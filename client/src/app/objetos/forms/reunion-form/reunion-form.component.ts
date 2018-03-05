import { Component, OnInit, OnDestroy, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { TabsetComponent } from 'ngx-bootstrap';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { INgxMyDpOptions, IMyDateModel } from 'ngx-mydatepicker';

import { Map } from 'immutable';
import * as moment from 'moment';

import { IObjeto } from '../../../objetos/shared/models/objeto.model';
import { IReunion, Reunion } from '../../../objetos/shared/models/reunion.model';

import { ObjetoService } from '../../shared/services/objeto.service';
import { ObjetoStreamService } from '../../shared/services/objeto-stream.service';
import { GrowlMessagesService } from '../../shared/services/growl-messages.service';

import { objetoNumeroComparator, paddy } from '../../shared/utils';
import { MULTISELECT_SETTINGS, MULTISELECT_ASISTENTES_TEXTS, DATEPICKER_OPTIONS } from '../../shared/config';
import * as TIPOS from '../../shared/tipos';

@Component({
  selector: 'app-reunion-form',
  templateUrl: './reunion-form.component.html',
  styleUrls: ['./reunion-form.component.css'],
  exportAs: 'ReunionForm'
})
export class ReunionFormComponent implements OnInit, OnDestroy {
  @Input() objetoId: number;
  @Input() documentoId: number;

  objeto: Reunion;
  private objetos: Map<number, any>;
  private objetosSubscription: Subscription;

  // Formulario
  formGroup: FormGroup;
  private submitted: boolean = false;
  @ViewChild('ReunionForm') form;
  @Output() onSubmittedForm = new EventEmitter();

  private max_num: number;

  // Datepicker config
  private readonly fechaDateOptions: INgxMyDpOptions = DATEPICKER_OPTIONS;

  // Multiselect config
  private asistentesOptions: IMultiSelectOption[] = [];
  private readonly multiselectSettings: IMultiSelectSettings = MULTISELECT_SETTINGS;
  private readonly multiselectAsistentesTexts: IMultiSelectTexts = MULTISELECT_ASISTENTES_TEXTS;

  constructor(
    private objetoService: ObjetoService,
    private objetoStreamService: ObjetoStreamService,
    private growlMessagesService: GrowlMessagesService,
    private fb: FormBuilder
  ) {
    this.objetosSubscription = this.objetoStreamService.objetosMap$.subscribe(map => {
      this.objetos = map;
      this.asistentesOptions = map.filter(obj => obj.tipo_objeto === TIPOS.PARTICIPANTE)
      .toArray()
      .map(obj => {return {id: obj.id, name: `${obj.codigo} ${obj.nombre}`}});
    });
  }

  ngOnInit() {
    let fecha = new Date();
    this.formGroup = this.fb.group({
      id: null,
      documento: [this.documentoId, Validators.required],
      lugar: '',
      fecha: [{ jsdate: fecha }, Validators.required],
      hora: [
        `${paddy(fecha.getHours(), 2)}:${paddy(fecha.getMinutes(), 2)}`, 
        [Validators.required, Validators.pattern('(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]')]
      ],
      asistentes: [[]],
      resultados: ''
    });

    if(this.objetoId){
      this.objetoService.getObjeto(this.objetoId, {expand: 'logs'})
        .then(objeto => {
          this.objeto = objeto;
          this.formGroup.controls['id'].setValue(this.objeto.id);
          this.formGroup.controls['lugar'].setValue(this.objeto.lugar);
          this.formGroup.controls['asistentes'].setValue(this.objeto.asistentes);
          this.formGroup.controls['resultados'].setValue(this.objeto.resultados);

          let fecha_aux = new Date(this.objeto.fecha);
          this.formGroup.controls['fecha'].setValue({ jsdate: fecha_aux });
          this.formGroup.controls['hora'].setValue(`${paddy(fecha_aux.getHours(), 2)}:${paddy(fecha_aux.getMinutes(), 2)}`);
        });
    } else {
      let max_obj = this.objetos.filter(obj => obj.tipo_objeto === TIPOS.REUNION).max(objetoNumeroComparator);
      let num: number = max_obj ? max_obj.numero + 1 : 1;
      let codigo: string = `${TIPOS.CONFIG[TIPOS.REUNION].prefix}-${paddy(num, 4)}`;
      this.objeto = new Reunion({documento: this.documentoId, codigo: codigo, numero: num});
    }
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.objetosSubscription.unsubscribe();
  }

  onSubmit({ value, valid, dirty }: { value: IReunion, valid: boolean, dirty: boolean }): void {
    this.submitted = true;
    if(!valid){
      this.growlMessagesService.newMessage({severity:'warn', summary: this.objeto.codigo, detail:'El formulario contiene errores.'});
    } else {
      if (dirty){
        if(value['fecha_version']){
          value['fecha_version'] = moment((<any>value['fecha_version']).jsdate).format('YYYY-MM-DD');
        }
        if(value['fecha'] && value['hora']){
          let aux_fecha = (<any>value['fecha']).jsdate;
          value['fecha'] = new Date(
            aux_fecha.getFullYear(), aux_fecha.getMonth(), aux_fecha.getDate(),
            value['hora'].split(':')[0], value['hora'].split(':')[1]
          );
        }
        this.objetoService.createOrUpdateObjeto(value, TIPOS.CONFIG[TIPOS.REUNION].api_reference)
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
