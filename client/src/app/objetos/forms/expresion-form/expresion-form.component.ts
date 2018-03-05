import { Component, OnInit, OnDestroy, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { TabsetComponent } from 'ngx-bootstrap';

import { Map } from 'immutable';

import { IObjeto } from '../../../objetos/shared/models/objeto.model';
import { IExpresion, Expresion } from '../../../objetos/shared/models/expresion.model';

import { ObjetoService } from '../../shared/services/objeto.service';
import { ObjetoStreamService } from '../../shared/services/objeto-stream.service';
import { GrowlMessagesService } from '../../shared/services/growl-messages.service';

import * as TIPOS from '../../shared/tipos';
import { ISelectOption, TIPOS_EXPRESION } from '../../shared/selects';

@Component({
  selector: 'app-expresion-form',
  templateUrl: './expresion-form.component.html',
  styleUrls: ['./expresion-form.component.css'],
  exportAs: 'ExpresionForm'
})
export class ExpresionFormComponent implements OnInit, OnDestroy {
  @Input() objetoId: number;
  @Input() tipo: string;
  @Input() objetoPadreId: number;
  @Input() objetoPadreTipo: string;

  objeto: Expresion;
  private objetos: Map<number, any>;
  private objetosSubscription: Subscription;

  // Formulario
  formGroup: FormGroup;
  private submitted: boolean = false;
  @ViewChild('ExpresionForm') form;
  @Output() onSubmittedForm = new EventEmitter();

  private tipo_objeto: number = null;
  private tipo_valor: number = null;
  private asociacion: number = null;
  private operacion_sistema: number = null;

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
    switch(this.objetoPadreTipo){
      case TIPOS.TIPO_OBJETOS:
        this.tipo_objeto = this.objetoPadreId;
        break;
      case TIPOS.TIPO_VALOR:
        this.tipo_valor = this.objetoPadreId;
        break;
      case TIPOS.ASOCIACION:
        this.asociacion = this.objetoPadreId;
        break;
      case TIPOS.OPERACION_SISTEMA:
        this.operacion_sistema = this.objetoPadreId;
        break;
    }

    this.formGroup = this.fb.group({
      id: null,
      tipo_objeto: this.tipo_objeto,
      tipo_valor: this.tipo_valor,
      asociacion: this.asociacion,
      operacion_sistema: this.operacion_sistema,
      nombre: ['', Validators.required],
      tipo: this.tipo,
      expresion_lenguaje_natural: '',
      expresion_ocl: '',
      comentarios: ''
    });

    if(this.objetoId){
      this.objetoService.getElement(this.objetoId, TIPOS.CONFIG[TIPOS.EXPRESION].api_reference)
        .then(objeto => {
          this.objeto = objeto;
          this.formGroup.controls['id'].setValue(this.objeto.id);
          this.formGroup.controls['tipo_objeto'].setValue(this.objeto.tipo_objeto);
          this.formGroup.controls['tipo_valor'].setValue(this.objeto.tipo_valor);
          this.formGroup.controls['asociacion'].setValue(this.objeto.asociacion);
          this.formGroup.controls['operacion_sistema'].setValue(this.objeto.operacion_sistema);
          this.formGroup.controls['nombre'].setValue(this.objeto.nombre);
          this.formGroup.controls['tipo'].setValue(this.objeto.tipo);
          this.formGroup.controls['expresion_lenguaje_natural'].setValue(this.objeto.expresion_lenguaje_natural);
          this.formGroup.controls['expresion_ocl'].setValue(this.objeto.expresion_ocl);
          this.formGroup.controls['comentarios'].setValue(this.objeto.comentarios);
        });
    } else {
      this.objeto = new Expresion({
        tipo_objeto: this.tipo_objeto, tipo_valor: this.tipo_valor, asociacion: this.asociacion, operacion_sistema: this.operacion_sistema, tipo: this.tipo
      });
    }
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.objetosSubscription.unsubscribe();
  }

  onSubmit({ value, valid, dirty }: { value: IExpresion, valid: boolean, dirty: boolean }): void {
    this.submitted = true;
    let aux_valid = valid && (value['tipo_objeto'] || value['tipo_valor'] || value['asociacion'] || value['operacion_sistema']);
    if(!aux_valid){
      this.growlMessagesService.newMessage({severity:'warn', summary: 'Atención', detail:'El formulario contiene errores.'});
    } else {
      if (dirty){
        this.objetoService.createOrUpdateObjeto(value, TIPOS.CONFIG[TIPOS.EXPRESION].api_reference)
          .then(obj => {
            this.objeto = obj;
            this.growlMessagesService.newMessage({severity:'success', summary: 'OK', detail:'Objeto guardado correctamente.'});
            this.objetoStreamService.updateMap(this.objetos.withMutations(map => {
              let padre: IObjeto = map.get(this.objetoPadreId);
              let hijo_index = padre[TIPOS.CONFIG[TIPOS.EXPRESION].related_name].findIndex(dat => obj.id === dat.id);

              if(hijo_index > -1){
                padre[TIPOS.CONFIG[TIPOS.EXPRESION].related_name].splice(hijo_index, 1, obj);
              } else {
                padre[TIPOS.CONFIG[TIPOS.EXPRESION].related_name].push(obj);
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
