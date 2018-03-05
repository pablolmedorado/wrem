import { Component, OnInit, OnDestroy, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { TabsetComponent } from 'ngx-bootstrap';

import { Map } from 'immutable';
import * as moment from 'moment';

import { IObjeto } from '../../../objetos/shared/models/objeto.model';
import { IObjetivo, Objetivo } from '../../../objetos/shared/models/objetivo.model';

import { ObjetoService } from '../../shared/services/objeto.service';
import { ObjetoStreamService } from '../../shared/services/objeto-stream.service';
import { GrowlMessagesService } from '../../shared/services/growl-messages.service';

import { objetoNumeroComparator, paddy } from '../../shared/utils';
import * as TIPOS from '../../shared/tipos';
import {
  ISelectOption, TIPOS_IMPORTANCIA, TIPOS_URGENCIA, TIPOS_ESTADO_DESARROLLO, TIPOS_ESTABILIDAD
} from '../../shared/selects';

@Component({
  selector: 'app-objetivo-form',
  templateUrl: './objetivo-form.component.html',
  styleUrls: ['./objetivo-form.component.css'],
  exportAs: 'ObjetivoForm'
})
export class ObjetivoFormComponent implements OnInit, OnDestroy {
  @Input() objetoId: number;
  @Input() documentoId: number;

  objeto: Objetivo;
  private objetos: Map<number, any>;
  private objetosSubscription: Subscription;

  // Formulario
  formGroup: FormGroup;
  private submitted: boolean = false;
  @ViewChild('ObjetivoForm') form;
  @Output() onSubmittedForm = new EventEmitter();

  private max_num: number;
  private objetivosOptions: IObjeto[];

  private readonly tipos_importancia: ISelectOption[] = TIPOS_IMPORTANCIA;
  private readonly tipos_urgencia: ISelectOption[] = TIPOS_URGENCIA;
  private readonly tipos_estado_desarrollo: ISelectOption[] = TIPOS_ESTADO_DESARROLLO;
  private readonly tipos_estabilidad: ISelectOption[] = TIPOS_ESTABILIDAD;

  constructor(
    private objetoService: ObjetoService,
    private objetoStreamService: ObjetoStreamService,
    private growlMessagesService: GrowlMessagesService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.objetosSubscription = this.objetoStreamService.objetosMap$.subscribe(map => {
      this.objetos = map;
      this.objetivosOptions = map
        .filter((obj: IObjeto) => obj.tipo_objeto === TIPOS.OBJETIVO && obj.id !== this.objetoId)
        .toArray();
    });

    this.formGroup = this.fb.group({
      id: null,
      documento: [this.documentoId, Validators.required],
      descripcion: '',
      importancia: ['PD', Validators.required],
      urgencia: 'PD',
      estado_desarrollo: ['PD', Validators.required],
      estabilidad: ['PD', Validators.required],
      padre: null
    });

    if(this.objetoId){
      this.objetoService.getObjeto(this.objetoId, {expand: 'logs'})
        .then(objeto => {
          this.objeto = objeto;
          this.formGroup.controls['id'].setValue(this.objeto.id);
          this.formGroup.controls['descripcion'].setValue(this.objeto.descripcion);
          this.formGroup.controls['importancia'].setValue(this.objeto.importancia);
          this.formGroup.controls['urgencia'].setValue(this.objeto.urgencia);
          this.formGroup.controls['estado_desarrollo'].setValue(this.objeto.estado_desarrollo);
          this.formGroup.controls['estabilidad'].setValue(this.objeto.estabilidad);
          this.formGroup.controls['padre'].setValue(this.objeto.padre);
        });
    } else {
      let max_obj = this.objetos.filter(obj => obj.tipo_objeto === TIPOS.OBJETIVO).max(objetoNumeroComparator);
      let num: number = max_obj ? max_obj.numero + 1 : 1;
      let codigo: string = `${TIPOS.CONFIG[TIPOS.OBJETIVO].prefix}-${paddy(num, 4)}`;
      this.objeto = new Objetivo({documento: this.documentoId, codigo: codigo, numero: num});
    }
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.objetosSubscription.unsubscribe();
  }

  onSubmit({ value, valid, dirty }: { value: IObjetivo, valid: boolean, dirty: boolean }): void {
    this.submitted = true;
    if(!valid){
      this.growlMessagesService.newMessage({severity:'warn', summary: this.objeto.codigo, detail:'El formulario contiene errores.'});
    } else {
      if (dirty){
        if(value['fecha_version']){
          value['fecha_version'] = moment((<any>value['fecha_version']).jsdate).format('YYYY-MM-DD');
        }
        this.objetoService.createOrUpdateObjeto(value, TIPOS.CONFIG[TIPOS.OBJETIVO].api_reference)
          .then(obj => {
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
