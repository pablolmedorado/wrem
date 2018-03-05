import { Component, OnInit, OnDestroy, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { TabsetComponent } from 'ngx-bootstrap';

import { Map } from 'immutable';

import { IObjeto } from '../../../objetos/shared/models/objeto.model';
import { IDatoEspecifico, DatoEspecifico, IRequisitoInformacion } from '../../../objetos/shared/models/requisito-informacion.model';

import { ObjetoService } from '../../shared/services/objeto.service';
import { ObjetoStreamService } from '../../shared/services/objeto-stream.service';
import { GrowlMessagesService } from '../../shared/services/growl-messages.service';

import * as TIPOS from '../../shared/tipos';

@Component({
  selector: 'app-dato-especifico-form',
  templateUrl: './dato-especifico-form.component.html',
  styleUrls: ['./dato-especifico-form.component.css'],
  exportAs: 'DatoEspecificoForm'
})
export class DatoEspecificoFormComponent implements OnInit, OnDestroy {
  @Input() objetoId: number;
  @Input() objetoPadreId: number;

  objeto: DatoEspecifico;
  private objetos: Map<number, any>;
  private objetosSubscription: Subscription;

  // Formulario
  formGroup: FormGroup;
  private submitted: boolean = false;
  @ViewChild('DatoEspecificoForm') form;
  @Output() onSubmittedForm = new EventEmitter();

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
      requisito_informacion: [this.objetoPadreId, Validators.required],
      descripcion: '',
      comentarios: ''
    });

    if(this.objetoId){
      this.objetoService.getElement(this.objetoId, TIPOS.CONFIG[TIPOS.DATO_ESPECIFICO].api_reference)
        .then(objeto => {
          this.objeto = objeto;
          this.objetoPadreId = objeto.requisito_informacion;
          this.formGroup.controls['id'].setValue(this.objeto.id);
          this.formGroup.controls['requisito_informacion'].setValue(this.objeto.requisito_informacion);
          this.formGroup.controls['descripcion'].setValue(this.objeto.descripcion);
          this.formGroup.controls['comentarios'].setValue(this.objeto.comentarios);
        });
    } else {
      this.objeto = new DatoEspecifico({ requisito_informacion: this.objetoPadreId });
    }
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.objetosSubscription.unsubscribe();
  }

  onSubmit({ value, valid, dirty}: { value: IDatoEspecifico, valid: boolean, dirty: boolean }): void {
    this.submitted = true;
    if(!valid){
      this.growlMessagesService.newMessage({severity:'warn', summary: 'Atención', detail:'El formulario contiene errores.'});
    } else {
      if (dirty){
        this.objetoService.createOrUpdateObjeto(value, TIPOS.CONFIG[TIPOS.DATO_ESPECIFICO].api_reference)
          .then(obj => {
            this.objeto = obj;
            this.growlMessagesService.newMessage({severity:'success', summary: 'OK', detail:'Objeto guardado correctamente.'});
            this.objetoStreamService.updateMap(this.objetos.withMutations(map => {
              let padre: IRequisitoInformacion = map.get(this.objetoPadreId);
              let dat_index = padre[TIPOS.CONFIG[TIPOS.DATO_ESPECIFICO].related_name].findIndex(dat => obj.id === dat.id);

              if(dat_index > -1){
                padre[TIPOS.CONFIG[TIPOS.DATO_ESPECIFICO].related_name].splice(dat_index, 1, obj);
              } else {
                padre[TIPOS.CONFIG[TIPOS.DATO_ESPECIFICO].related_name].push(obj);
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
