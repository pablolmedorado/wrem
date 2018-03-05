import { Component, OnInit, OnDestroy, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { TabsetComponent } from 'ngx-bootstrap';

import { Map } from 'immutable';
import * as moment from 'moment';

import { IObjeto } from '../../../objetos/shared/models/objeto.model';
import { IMatrizTrazabilidad, MatrizTrazabilidad } from '../../../objetos/shared/models/matriz-trazabilidad.model';

import { ObjetoService } from '../../shared/services/objeto.service';
import { ObjetoStreamService } from '../../shared/services/objeto-stream.service';
import { GrowlMessagesService } from '../../shared/services/growl-messages.service';

import { objetoNumeroComparator, paddy } from '../../shared/utils';
import * as TIPOS from '../../shared/tipos';

@Component({
  selector: 'app-matriz-trazabilidad-form',
  templateUrl: './matriz-trazabilidad-form.component.html',
  styleUrls: ['./matriz-trazabilidad-form.component.css'],
  exportAs: 'MatrizTrazabilidadForm'
})
export class MatrizTrazabilidadFormComponent implements OnInit, OnDestroy {
  @Input() objetoId: number;
  @Input() documentoId: number;

  objeto: MatrizTrazabilidad;
  private objetos: Map<number, any>;
  private objetosSubscription: Subscription;
  private tiposTrazablesSubscription: Subscription;

  // Formulario
  formGroup: FormGroup;
  private submitted: boolean = false;
  @ViewChild('MatrizTrazabilidadForm') form;
  @Output() onSubmittedForm = new EventEmitter();

  private max_num: number;
  private tiposOptions: Array<TIPOS.IObjetoTrazable>;
  private tipoFilaSeleccionado: TIPOS.IObjetoTrazable;
  private tipoColumnaSeleccionado: TIPOS.IObjetoTrazable;

  constructor(
    private objetoService: ObjetoService,
    private objetoStreamService: ObjetoStreamService,
    private growlMessagesService: GrowlMessagesService,
    private fb: FormBuilder
  ) {
    this.objetosSubscription = this.objetoStreamService.objetosMap$.subscribe(map => {
      this.objetos = map;
    });
    this.tiposTrazablesSubscription = this.objetoStreamService.tiposTrazables$.subscribe(tipos => {
      this.tiposOptions = tipos;
    });
  }

  ngOnInit() {
    this.tipoFilaSeleccionado = null;
    this.tipoColumnaSeleccionado = null;

    this.formGroup = this.fb.group({
      id: null,
      documento: [this.documentoId, Validators.required],
      tipo_filas: [null, Validators.required],
      subtipo_filas: null,
      tipo_columnas: [null, Validators.required],
      subtipo_columnas: null
    });

    if(this.objetoId){
      this.objetoService.getObjeto(this.objetoId, {expand: 'logs'})
        .then((objeto: IMatrizTrazabilidad) => {
          this.objeto = objeto;
          this.formGroup.controls['id'].setValue(this.objeto.id);
          this.formGroup.controls['tipo_filas'].setValue(this.objeto.tipo_filas);
          this.formGroup.controls['subtipo_filas'].setValue(this.objeto.subtipo_filas);
          this.formGroup.controls['tipo_columnas'].setValue(this.objeto.tipo_columnas);
          this.formGroup.controls['subtipo_columnas'].setValue(this.objeto.subtipo_columnas);

          this.tipoFilaSeleccionado = this.tiposOptions.find(tipo => tipo.id === this.objeto.tipo_filas && tipo.type === this.objeto.subtipo_filas);
          this.tipoColumnaSeleccionado = this.tiposOptions.find(tipo => tipo.id === this.objeto.tipo_columnas && tipo.type === this.objeto.subtipo_columnas);
        });
    } else {
      let max_obj = this.objetos.filter(obj => obj.tipo_objeto === TIPOS.MATRIZ_TRAZABILIDAD).max(objetoNumeroComparator);
      let num: number = max_obj ? max_obj.numero + 1 : 1;
      let codigo: string = `${TIPOS.CONFIG[TIPOS.MATRIZ_TRAZABILIDAD].prefix}-${paddy(num, 4)}`;
      this.objeto = new MatrizTrazabilidad({documento: this.documentoId, codigo: codigo, numero: num});
    }
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.objetosSubscription.unsubscribe();
    this.tiposTrazablesSubscription.unsubscribe();
  }

  onChangeFilas(event: any): void {
    this.formGroup.controls['tipo_filas'].setValue(this.tipoFilaSeleccionado ? this.tipoFilaSeleccionado.id : null);
    this.formGroup.controls['subtipo_filas'].setValue(this.tipoFilaSeleccionado ? this.tipoFilaSeleccionado.type : null);
    this.formGroup.controls['tipo_filas'].markAsDirty();
    this.formGroup.controls['subtipo_filas'].markAsDirty();
  }

  onChangeColumnas(event: any): void {
    this.formGroup.controls['tipo_columnas'].setValue(this.tipoColumnaSeleccionado ? this.tipoColumnaSeleccionado.id : null);
    this.formGroup.controls['subtipo_columnas'].setValue(this.tipoColumnaSeleccionado ? this.tipoColumnaSeleccionado.type : null);
    this.formGroup.controls['tipo_columnas'].markAsDirty();
    this.formGroup.controls['subtipo_columnas'].markAsDirty();
  }

  onSubmit({ value, valid, dirty }: { value: IMatrizTrazabilidad, valid: boolean, dirty: boolean }): void {
    this.submitted = true;
    if(!valid){
      this.growlMessagesService.newMessage({severity:'warn', summary: this.objeto.codigo, detail:'El formulario contiene errores.'});
    } else {
      if (dirty){
        if(value['fecha_version']){
          value['fecha_version'] = moment((<any>value['fecha_version']).jsdate).format('YYYY-MM-DD');
        }
        this.objetoService.createOrUpdateObjeto(value, TIPOS.CONFIG[TIPOS.MATRIZ_TRAZABILIDAD].api_reference)
          .then((obj: IMatrizTrazabilidad) => {
            this.objeto = obj;
            this.growlMessagesService.newMessage({severity:'success', summary: this.objeto.codigo, detail:'Objeto guardado correctamente.'});
            this.objetoStreamService.updateMap(this.objetos.withMutations(map => {
              if(map.get(obj.id)){
                map.delete(obj.id);        
              }
              map.set(obj.id, obj);
            }));
          })
          .catch(error => {
            this.growlMessagesService.newMessage({severity:'error', summary: this.objeto.codigo, detail:'Error al guardar el objeto.'});
          });
      }
      this.onSubmittedForm.emit();
    }
  }

}
