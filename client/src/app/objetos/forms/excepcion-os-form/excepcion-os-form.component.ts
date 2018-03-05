import { Component, OnInit, OnDestroy, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { TabsetComponent } from 'ngx-bootstrap';

import { Map } from 'immutable';

import { IObjeto } from '../../../objetos/shared/models/objeto.model';
import { IExcepcionOS, ExcepcionOS, IOperacionSistema } from '../../../objetos/shared/models/operacion-sistema.model';

import { ObjetoService } from '../../shared/services/objeto.service';
import { ObjetoStreamService } from '../../shared/services/objeto-stream.service';
import { GrowlMessagesService } from '../../shared/services/growl-messages.service';

import * as TIPOS from '../../shared/tipos';

@Component({
  selector: 'app-excepcion-os-form',
  templateUrl: './excepcion-os-form.component.html',
  styleUrls: ['./excepcion-os-form.component.css'],
  exportAs: 'ExcepcionOSForm'
})
export class ExcepcionOsFormComponent implements OnInit, OnDestroy {
  @Input() objetoId: number;
  @Input() objetoPadreId: number;

  objeto: ExcepcionOS;
  private objetos: Map<number, any>;
  private objetosSubscription: Subscription;

  // Formulario
  formGroup: FormGroup;
  private submitted: boolean = false;
  @ViewChild('ExcepcionOSForm') form;
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
      operacion_sistema: [this.objetoPadreId, Validators.required],
      nombre: ['', Validators.required],
      expresion_lenguaje_natural: '',
      expresion_ocl: '',
      condicion_lenguaje_natural: '',
      condicion_ocl: '',
      comentarios: ''
    });

    if(this.objetoId){
      this.objetoService.getElement(this.objetoId, TIPOS.CONFIG[TIPOS.EXCEPCION_OS].api_reference)
        .then(objeto => {
          this.objeto = objeto;
          this.formGroup.controls['id'].setValue(this.objeto.id);
          this.formGroup.controls['operacion_sistema'].setValue(this.objeto.operacion_sistema);
          this.formGroup.controls['nombre'].setValue(this.objeto.nombre);
          this.formGroup.controls['expresion_lenguaje_natural'].setValue(this.objeto.expresion_lenguaje_natural);
          this.formGroup.controls['expresion_ocl'].setValue(this.objeto.expresion_ocl);
          this.formGroup.controls['condicion_lenguaje_natural'].setValue(this.objeto.condicion_lenguaje_natural);
          this.formGroup.controls['condicion_ocl'].setValue(this.objeto.condicion_ocl);
          this.formGroup.controls['comentarios'].setValue(this.objeto.comentarios);
        });
    } else {
      this.objeto = new ExcepcionOS({ operacion_sistema: this.objetoPadreId });
    }
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.objetosSubscription.unsubscribe();
  }

  onSubmit({ value, valid, dirty }: { value: IExcepcionOS, valid: boolean, dirty: boolean }): void {
    this.submitted = true;
    if(!valid){
      this.growlMessagesService.newMessage({severity:'warn', summary: 'Atención', detail:'El formulario contiene errores.'});
    } else {
      if (dirty){
        this.objetoService.createOrUpdateObjeto(value, TIPOS.CONFIG[TIPOS.EXCEPCION_OS].api_reference)
          .then(obj => {
            this.objeto = obj;
            this.growlMessagesService.newMessage({severity:'success', summary: 'OK', detail:'Objeto guardado correctamente.'});
            this.objetoStreamService.updateMap(this.objetos.withMutations(map => {
              let padre: IOperacionSistema = map.get(this.objetoPadreId);
              let hijo_index = padre[TIPOS.CONFIG[TIPOS.EXCEPCION_OS].related_name].findIndex(dat => obj.id === dat.id);

              if(hijo_index > -1){
                padre[TIPOS.CONFIG[TIPOS.EXCEPCION_OS].related_name].splice(hijo_index, 1, obj);
              } else {
                padre[TIPOS.CONFIG[TIPOS.EXCEPCION_OS].related_name].push(obj);
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
