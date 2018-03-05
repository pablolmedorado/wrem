import { Component, OnInit, OnDestroy, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { TabsetComponent } from 'ngx-bootstrap';

import { Map } from 'immutable';

import { IObjeto } from '../../../objetos/shared/models/objeto.model';
import { IRol, Rol, IAsociacion } from '../../../objetos/shared/models/asociacion.model';

import { ObjetoService } from '../../shared/services/objeto.service';
import { ObjetoStreamService } from '../../shared/services/objeto-stream.service';
import { GrowlMessagesService } from '../../shared/services/growl-messages.service';

import { objetoNumeroComparator, paddy } from '../../shared/utils';
import * as TIPOS from '../../shared/tipos';
import { ISelectOption, TIPOS_COMPONENTE, TIPOS_PROPIEDAD } from '../../shared/selects';

@Component({
  selector: 'app-rol-form',
  templateUrl: './rol-form.component.html',
  styleUrls: ['./rol-form.component.css'],
  exportAs: 'RolForm'
})
export class RolFormComponent implements OnInit, OnDestroy {
  @Input() objetoId: number;
  @Input() objetoPadreId: number;

  objeto: Rol;
  private objetos: Map<number, any>;
  private objetosSubscription: Subscription;

  // Formulario
  formGroup: FormGroup;
  private submitted: boolean = false;
  @ViewChild('RolForm') form;
  @Output() onSubmittedForm = new EventEmitter();

  private tiposOptions: IObjeto[];
  private readonly tiposRol: ISelectOption[] = TIPOS_COMPONENTE;
  private readonly tiposPropiedad: ISelectOption[] = TIPOS_PROPIEDAD;

  constructor(
    private objetoService: ObjetoService,
    private objetoStreamService: ObjetoStreamService,
    private growlMessagesService: GrowlMessagesService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.objetosSubscription = this.objetoStreamService.objetosMap$.subscribe(map => {
      this.objetos = map;
      this.tiposOptions = map
        .filter(obj => [TIPOS.TIPO_OBJETOS, TIPOS.ASOCIACION].includes(obj.tipo_objeto) && obj.id !== this.objetoPadreId)
        .toArray();
    });
    
    this.formGroup = this.fb.group({
      id: null,
      asociacion: [this.objetoPadreId, Validators.required],
      nombre: ['', Validators.required],
      tipo_base: [null, Validators.required],
      tipo: ['S', Validators.required],
      multiplicidad_inferior: {value: '', disabled: true},
      multiplicidad_superior: {value: '', disabled: true},
      tipo_propiedad: ['V', Validators.required],
      valor: '',
      descripcion: '',
      comentarios: ''
    });

    if(this.objetoId){
      this.objetoService.getElement(this.objetoId, TIPOS.CONFIG[TIPOS.ROL].api_reference)
        .then(objeto => {
          this.objeto = objeto;
          this.formGroup.controls['id'].setValue(this.objeto.id);
          this.formGroup.controls['asociacion'].setValue(this.objeto.asociacion);
          this.formGroup.controls['nombre'].setValue(this.objeto.nombre);
          this.formGroup.controls['tipo_base'].setValue(this.objeto.tipo_base);
          this.formGroup.controls['tipo'].setValue(this.objeto.tipo);
          this.formGroup.controls['multiplicidad_inferior'].setValue(this.objeto.multiplicidad_inferior);
          this.formGroup.controls['multiplicidad_superior'].setValue(this.objeto.multiplicidad_superior);
          this.formGroup.controls['tipo_propiedad'].setValue(this.objeto.tipo_propiedad);
          this.formGroup.controls['valor'].setValue(this.objeto.valor);
          this.formGroup.controls['descripcion'].setValue(this.objeto.descripcion);
          this.formGroup.controls['comentarios'].setValue(this.objeto.comentarios);

          this.enableDisableMultiplicidad();
          this.enableDisableValor();
        });
    } else {
      this.objeto = new Rol({asociacion: this.objetoPadreId});
    }
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.objetosSubscription.unsubscribe();
  }

  enableDisableMultiplicidad(): void {
    const tipo = this.formGroup.controls['tipo'].value;
    let inferior = this.formGroup.controls['multiplicidad_inferior'];
    let superior = this.formGroup.controls['multiplicidad_superior'];
    
    if(tipo === 'S'){
      inferior.disable();
      superior.disable();
    }else{
      inferior.enable();
      superior.enable();
    }
  }

  enableDisableValor(): void {
    const tipo_propiedad = this.formGroup.controls['tipo_propiedad'].value;
    tipo_propiedad === 'C' ? this.formGroup.controls['valor'].disable() : this.formGroup.controls['valor'].enable();
  }

  onSubmit({ value, valid, dirty }: { value: IRol, valid: boolean, dirty: boolean }): void {
    this.submitted = true;
    if(!valid){
      this.growlMessagesService.newMessage({severity:'warn', summary: 'Atención', detail:'El formulario contiene errores.'});
    } else {
      if (dirty){
        this.objetoService.createOrUpdateObjeto(value, TIPOS.CONFIG[TIPOS.ROL].api_reference)
          .then(obj => {
            this.objeto = obj;
            this.growlMessagesService.newMessage({severity:'success', summary: 'OK', detail:'Objeto guardado correctamente.'});
            this.objetoStreamService.updateMap(this.objetos.withMutations(map => {
              let padre: IAsociacion = map.get(this.objetoPadreId);
              let hijo_index = padre[TIPOS.CONFIG[TIPOS.ROL].related_name].findIndex(dat => obj.id === dat.id);

              if(hijo_index > -1){
                padre[TIPOS.CONFIG[TIPOS.ROL].related_name].splice(hijo_index, 1, obj);
              } else {
                padre[TIPOS.CONFIG[TIPOS.ROL].related_name].push(obj);
              }
              map.delete(this.objetoPadreId).set(this.objetoPadreId, padre);
            }));
          })
          .catch(error => {
            this.growlMessagesService.newMessage({severity:'error', summary: 'Error', detail:'Error al guardar el objeto.'});
          });
      }
      this.onSubmittedForm.emit();
    }
  }

}
