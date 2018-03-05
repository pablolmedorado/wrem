import { Component, OnInit, OnDestroy, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { TabsetComponent } from 'ngx-bootstrap';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';

import { Map } from 'immutable';
import * as moment from 'moment';

import { IObjeto } from '../../../objetos/shared/models/objeto.model';
import { IPeticionCambio, PeticionCambio } from '../../../objetos/shared/models/peticion-cambio.model';

import { ObjetoService } from '../../shared/services/objeto.service';
import { ObjetoStreamService } from '../../shared/services/objeto-stream.service';
import { GrowlMessagesService } from '../../shared/services/growl-messages.service';

import { objetoNumeroComparator, paddy } from '../../shared/utils';
import * as TIPOS from '../../shared/tipos';
import { MULTISELECT_SETTINGS, MULTISELECT_PARTICIPANTES_TEXTS } from '../../shared/config';
import { ISelectOption, TIPOS_IMPORTANCIA, TIPOS_URGENCIA, TIPOS_ESTADO_PETICION_CAMBIO } from '../../shared/selects';

@Component({
  selector: 'app-peticion-cambio-form',
  templateUrl: './peticion-cambio-form.component.html',
  styleUrls: ['./peticion-cambio-form.component.css'],
  exportAs: 'PeticionCambioForm'
})
export class PeticionCambioFormComponent implements OnInit, OnDestroy {
  @Input() objetoId: number;
  @Input() documentoId: number;

  objeto: PeticionCambio;
  private objetos: Map<number, any>;
  private objetosSubscription: Subscription;

  // Formulario
  formGroup: FormGroup;
  private submitted: boolean = false;
  @ViewChild('PeticionCambioForm') form;
  @Output() onSubmittedForm = new EventEmitter();

  private max_num: number;
  private objetos_afectados_directamente: IObjeto[];

  private readonly tipos_importancia: ISelectOption[] = TIPOS_IMPORTANCIA;
  private readonly tipos_urgencia: ISelectOption[] = TIPOS_URGENCIA;
  private readonly tipos_estado: ISelectOption[] = TIPOS_ESTADO_PETICION_CAMBIO;

  constructor(
    private objetoService: ObjetoService,
    private objetoStreamService: ObjetoStreamService,
    private growlMessagesService: GrowlMessagesService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.objetosSubscription = this.objetoStreamService.objetosMap$.subscribe(map => {
      this.objetos = map;
      this.objetos_afectados_directamente = map.filter((obj: IObjeto) => obj.trazabilidad_desde.includes(this.objetoId)).toArray();
    });

    this.formGroup = this.fb.group({
      id: null,
      documento: [this.documentoId, Validators.required],
      descripcion: '',
      analisis: '',
      importancia: 'PD',
      urgencia: 'PD',
      estado: 'PD'
    });

    if(this.objetoId){
      this.objetoService.getObjeto(this.objetoId, {expand: 'logs'})
        .then(objeto => {
          this.objeto = objeto;
          this.formGroup.controls['id'].setValue(this.objeto.id);
          this.formGroup.controls['descripcion'].setValue(this.objeto.descripcion);
          this.formGroup.controls['analisis'].setValue(this.objeto.analisis);
          this.formGroup.controls['importancia'].setValue(this.objeto.importancia);
          this.formGroup.controls['urgencia'].setValue(this.objeto.urgencia);
          this.formGroup.controls['estado'].setValue(this.objeto.estado);
        });
    } else {
      let max_obj = this.objetos.filter(obj => obj.tipo_objeto === TIPOS.PETICION_CAMBIO).max(objetoNumeroComparator);
      let num: number = max_obj ? max_obj.numero + 1 : 1;
      let codigo: string = `${TIPOS.CONFIG[TIPOS.PETICION_CAMBIO].prefix}-${paddy(num, 4)}`;
      this.objeto = new PeticionCambio({documento: this.documentoId, codigo: codigo, numero: num});
    }
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.objetosSubscription.unsubscribe();
  }

  onSubmit({ value, valid, dirty }: { value: IPeticionCambio, valid: boolean, dirty: boolean }): void {
    this.submitted = true;
    if(!valid){
      this.growlMessagesService.newMessage({severity:'warn', summary: this.objeto.codigo, detail:'El formulario contiene errores.'});
    } else {
      if (dirty){
        if(value['fecha_version']){
          value['fecha_version'] = moment((<any>value['fecha_version']).jsdate).format('YYYY-MM-DD');
        }
        this.objetoService.createOrUpdateObjeto(value, TIPOS.CONFIG[TIPOS.PETICION_CAMBIO].api_reference)
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
