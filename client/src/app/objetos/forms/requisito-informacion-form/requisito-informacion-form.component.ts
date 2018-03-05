import { Component, OnInit, OnDestroy, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { TabsetComponent } from 'ngx-bootstrap';

import { Map } from 'immutable';
import * as moment from 'moment';

import { IObjeto } from '../../../objetos/shared/models/objeto.model';
import { IRequisitoInformacion, RequisitoInformacion } from '../../../objetos/shared/models/requisito-informacion.model';

import { ObjetoService } from '../../shared/services/objeto.service';
import { ObjetoStreamService } from '../../shared/services/objeto-stream.service';
import { GrowlMessagesService } from '../../shared/services/growl-messages.service';

import { objetoNumeroComparator, paddy } from '../../shared/utils';
import * as TIPOS from '../../shared/tipos';
import {
  ISelectOption, TIPOS_IMPORTANCIA, TIPOS_URGENCIA, TIPOS_ESTADO_DESARROLLO, TIPOS_ESTABILIDAD, TIPOS_UNIDADES_TIEMPO
} from '../../shared/selects';

@Component({
  selector: 'app-requisito-informacion-form',
  templateUrl: './requisito-informacion-form.component.html',
  styleUrls: ['./requisito-informacion-form.component.css'],
  exportAs: 'RequisitoInformacionForm'
})
export class RequisitoInformacionFormComponent implements OnInit, OnDestroy {
  @Input() objetoId: number;
  @Input() documentoId: number;

  objeto: RequisitoInformacion;
  private objetos: Map<number, any>;
  private objetosSubscription: Subscription;

  // Formulario
  formGroup: FormGroup;
  private submitted: boolean = false;
  @ViewChild('RequisitoInformacionForm') form;
  @Output() onSubmittedForm = new EventEmitter();

  private max_num: number;

  private readonly tipos_importancia: ISelectOption[] = TIPOS_IMPORTANCIA;
  private readonly tipos_urgencia: ISelectOption[] = TIPOS_URGENCIA;
  private readonly tipos_estado_desarrollo: ISelectOption[] = TIPOS_ESTADO_DESARROLLO;
  private readonly tipos_estabilidad: ISelectOption[] = TIPOS_ESTABILIDAD;
  private readonly tipos_unidades_tiempo: ISelectOption[] = TIPOS_UNIDADES_TIEMPO;

  constructor(
    private objetoService: ObjetoService,
    private objetoStreamService: ObjetoStreamService,
    private growlMessagesService: GrowlMessagesService,
    private fb: FormBuilder
  ) {
    this.objetosSubscription = this.objetoStreamService.objetosMap$.subscribe(map => {
      this.objetos = map;
    });
  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      id: null,
      documento: [this.documentoId, Validators.required],
      tipo: ['I', Validators.required],
      descripcion: '',
      importancia: ['PD', Validators.required],
      urgencia: ['PD', Validators.required],
      estado_desarrollo: ['PD', Validators.required],
      estabilidad: ['PD', Validators.required],
      tiempo_vida_max: [0, Validators.min(0)],
      tiempo_vida_max_ud: ['PD', Validators.required],
      tiempo_vida_med: [0, Validators.min(0)],
      tiempo_vida_med_ud: ['PD', Validators.required],
      ocurrencias_simultaneas_max: [0, Validators.min(0)],
      ocurrencias_simultaneas_med: [0, Validators.min(0)]
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
          this.formGroup.controls['tiempo_vida_max'].setValue(this.objeto.tiempo_vida_max);
          this.formGroup.controls['tiempo_vida_max_ud'].setValue(this.objeto.tiempo_vida_max_ud);
          this.formGroup.controls['tiempo_vida_med'].setValue(this.objeto.tiempo_vida_med);
          this.formGroup.controls['tiempo_vida_med_ud'].setValue(this.objeto.tiempo_vida_med_ud);
          this.formGroup.controls['ocurrencias_simultaneas_max'].setValue(this.objeto.ocurrencias_simultaneas_max);
          this.formGroup.controls['ocurrencias_simultaneas_med'].setValue(this.objeto.ocurrencias_simultaneas_med);
        });
    } else {
      let max_obj = this.objetos.filter(obj => obj.tipo_objeto === TIPOS.REQUISITO_INFORMACION).max(objetoNumeroComparator);
      let num: number = max_obj ? max_obj.numero + 1 : 1;
      let codigo: string = `${TIPOS.CONFIG[TIPOS.REQUISITO_INFORMACION].prefix}-${paddy(num, 4)}`;
      this.objeto = new RequisitoInformacion({documento: this.documentoId, codigo: codigo, numero: num, tipo: 'I'});
    }
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.objetosSubscription.unsubscribe();
  }

  onSubmit({ value, valid, dirty }: { value: IRequisitoInformacion, valid: boolean, dirty: boolean }): void {
    this.submitted = true;
    if(!valid){
      this.growlMessagesService.newMessage({severity:'warn', summary: this.objeto.codigo, detail:'El formulario contiene errores.'});
    } else {
      if (dirty){
        if(value['fecha_version']){
          value['fecha_version'] = moment((<any>value['fecha_version']).jsdate).format('YYYY-MM-DD');
        }
        this.objetoService.createOrUpdateObjeto(value, TIPOS.CONFIG[TIPOS.REQUISITO_INFORMACION].api_reference)
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
