import { Component, OnInit, OnDestroy, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { TabsetComponent } from 'ngx-bootstrap';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';

import { Map } from 'immutable';

import { IObjeto } from '../../../objetos/shared/models/objeto.model';
import { IAlternativa, Alternativa } from '../../../objetos/shared/models/alternativa.model';

import { ObjetoService } from '../../shared/services/objeto.service';
import { ObjetoStreamService } from '../../shared/services/objeto-stream.service';
import { GrowlMessagesService } from '../../shared/services/growl-messages.service';

import * as TIPOS from '../../shared/tipos';
import { MULTISELECT_SETTINGS, MULTISELECT_PARTICIPANTES_TEXTS } from '../../shared/config';

@Component({
  selector: 'app-alternativa-form',
  templateUrl: './alternativa-form.component.html',
  styleUrls: ['./alternativa-form.component.css'],
  exportAs: 'AlternativaForm'
})
export class AlternativaFormComponent implements OnInit, OnDestroy {
  @Input() objetoId: number;
  @Input() objetoPadreId: number;
  @Input() objetoPadreTipo: string;

  objeto: Alternativa;
  private objetos: Map<number, any>;
  private objetosSubscription: Subscription;

  // Formulario
  formGroup: FormGroup;
  private submitted: boolean = false;
  @ViewChild('AlternativaForm') form;
  @Output() onSubmittedForm = new EventEmitter();

  // Multiselect config
  private participantesOptions: IMultiSelectOption[] = [];
  private readonly multiselectSettings: IMultiSelectSettings = MULTISELECT_SETTINGS;
  private readonly multiselectParticipantesTexts: IMultiSelectTexts = MULTISELECT_PARTICIPANTES_TEXTS;

  private conflicto: number = null;
  private defecto: number = null;

  constructor(
    private objetoService: ObjetoService,
    private objetoStreamService: ObjetoStreamService,
    private growlMessagesService: GrowlMessagesService,
    private fb: FormBuilder
  ) {
    this.objetosSubscription = this.objetoStreamService.objetosMap$.subscribe(map => {
      this.objetos = map;
      this.participantesOptions = map.filter(obj => obj.tipo_objeto === TIPOS.PARTICIPANTE)
        .toArray()
        .map(obj => {return {id: obj.id, name: `${obj.codigo} ${obj.nombre}`}});
    });
  }

  ngOnInit() {
    switch(this.objetoPadreTipo){
      case TIPOS.CONFLICTO:
        this.conflicto = this.objetoPadreId;
        break;
      case TIPOS.DEFECTO:
        this.defecto = this.objetoPadreId;
        break;
    }

    this.formGroup = this.fb.group({
      id: null,
      conflicto: this.conflicto,
      defecto: this.defecto,
      nombre: ['', Validators.required],
      autores: [[]],
      descripcion: '',
      comentarios: ''
    });

    if(this.objetoId){
      this.objetoService.getElement(this.objetoId, TIPOS.CONFIG[TIPOS.ALTERNATIVA].api_reference, {expand: 'logs'})
        .then(objeto => {
          this.objeto = objeto;
          this.objetoPadreId = objeto.requisito_informacion;
          this.formGroup.controls['id'].setValue(this.objeto.id);
          this.formGroup.controls['conflicto'].setValue(this.objeto.conflicto);
          this.formGroup.controls['defecto'].setValue(this.objeto.defecto);
          this.formGroup.controls['nombre'].setValue(this.objeto.nombre);
          this.formGroup.controls['autores'].setValue(this.objeto.autores);
          this.formGroup.controls['descripcion'].setValue(this.objeto.descripcion);
          this.formGroup.controls['comentarios'].setValue(this.objeto.comentarios);
        });
    } else {
      this.objeto = new Alternativa({ conflicto: this.conflicto, defecto: this.defecto });
    }
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.objetosSubscription.unsubscribe();
  }

  onSubmit({ value, valid, dirty}: { value: IAlternativa, valid: boolean, dirty: boolean }): void {
    this.submitted = true;
    let aux_valid = valid && (value['conflicto'] || value['defecto']);
    if(!aux_valid){
      this.growlMessagesService.newMessage({severity:'warn', summary: 'Atención', detail:'El formulario contiene errores.'});
    } else {
      if (dirty){
        this.objetoService.createOrUpdateObjeto(value, TIPOS.CONFIG[TIPOS.ALTERNATIVA].api_reference)
          .then(obj => {
            this.objeto = obj;
            this.growlMessagesService.newMessage({severity:'success', summary: 'OK', detail:'Objeto guardado correctamente.'});
            this.objetoStreamService.updateMap(this.objetos.withMutations(map => {
              let padre: IObjeto = map.get(this.objetoPadreId);
              let dat_index = padre[TIPOS.CONFIG[TIPOS.ALTERNATIVA].related_name].findIndex(dat => obj.id === dat.id);

              if(dat_index > -1){
                padre[TIPOS.CONFIG[TIPOS.ALTERNATIVA].related_name].splice(dat_index, 1, obj);
              } else {
                padre[TIPOS.CONFIG[TIPOS.ALTERNATIVA].related_name].push(obj);
              }
              map.delete(this.objetoPadreId);
              map.set(this.objetoPadreId, padre);
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
