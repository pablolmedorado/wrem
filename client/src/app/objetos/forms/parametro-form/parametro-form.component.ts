import { Component, OnInit, OnDestroy, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { TabsetComponent } from 'ngx-bootstrap';

import { Map } from 'immutable';

import { IObjeto } from '../../../objetos/shared/models/objeto.model';
import { IParametro, Parametro, IOperacionSistema } from '../../../objetos/shared/models/operacion-sistema.model';

import { ObjetoService } from '../../shared/services/objeto.service';
import { ObjetoStreamService } from '../../shared/services/objeto-stream.service';
import { GrowlMessagesService } from '../../shared/services/growl-messages.service';

import { objetoNumeroComparator, paddy } from '../../shared/utils';
import * as TIPOS from '../../shared/tipos';
import { ISelectOption, TIPOS_COMPONENTE } from '../../shared/selects';

@Component({
  selector: 'app-parametro-form',
  templateUrl: './parametro-form.component.html',
  styleUrls: ['./parametro-form.component.css'],
  exportAs: 'ParametroForm'
})
export class ParametroFormComponent implements OnInit, OnDestroy {
  @Input() objetoId: number;
  @Input() objetoPadreId: number;

  objeto: Parametro;
  private objetos: Map<number, any>;
  private objetosSubscription: Subscription;

  // Formulario
  formGroup: FormGroup;
  private submitted: boolean = false;
  @ViewChild('ParametroForm') form;
  @Output() onSubmittedForm = new EventEmitter();

  private tiposOptions: IObjeto[];
  private tiposBaseDefaultOptions: TIPOS.ITipoBase[];
  private readonly tiposComponente: ISelectOption[] = TIPOS_COMPONENTE;

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
        .filter(obj => [TIPOS.TIPO_OBJETOS, TIPOS.TIPO_VALOR, TIPOS.ASOCIACION].includes(obj.tipo_objeto) && obj.id !== this.objetoPadreId)
        .toArray();
    });
    
    this.formGroup = this.fb.group({
      id: null,
      operacion_sistema: [this.objetoPadreId, Validators.required],
      nombre: ['', Validators.required],
      categoria_tipo_base: 'primitivo',
      tipo_base_default: null,
      tipo_base: null,
      tipo: ['S', Validators.required],
      multiplicidad_inferior: {value: '', disabled: true},
      multiplicidad_superior: {value: '', disabled: true},
      descripcion: '',
      comentarios: ''
    });

    if(this.objetoId){
      this.objetoService.getElement(this.objetoId, TIPOS.CONFIG[TIPOS.PARAMETRO].api_reference)
        .then(objeto => {
          this.objeto = objeto;
          this.formGroup.controls['id'].setValue(this.objeto.id);
          this.formGroup.controls['operacion_sistema'].setValue(this.objeto.operacion_sistema);
          this.formGroup.controls['nombre'].setValue(this.objeto.nombre);
          this.formGroup.controls['tipo_base_default'].setValue(this.objeto.tipo_base_default);
          this.formGroup.controls['tipo_base'].setValue(this.objeto.tipo_base);
          this.formGroup.controls['tipo'].setValue(this.objeto.tipo);
          this.formGroup.controls['multiplicidad_inferior'].setValue(this.objeto.multiplicidad_inferior);
          this.formGroup.controls['multiplicidad_superior'].setValue(this.objeto.multiplicidad_superior);
          this.formGroup.controls['descripcion'].setValue(this.objeto.descripcion);
          this.formGroup.controls['comentarios'].setValue(this.objeto.comentarios);

          if(objeto.tipo_base_default){
            this.formGroup.controls['categoria_tipo_base'].setValue('primitivo');
          }
          if(objeto.tipo_base){
            this.formGroup.controls['categoria_tipo_base'].setValue('objeto');
          }

          this.enableDisableMultiplicidad();
        });
    } else {
      this.objeto = new Parametro({operacion_sistema: this.objetoPadreId});
    }

    this.objetoService.listTiposBaseDefault()
      .then(tiposBaseDefault => this.tiposBaseDefaultOptions=tiposBaseDefault);
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.objetosSubscription.unsubscribe();
  }

  changeTipoBase(): void{
    this.formGroup.controls['tipo_base_default'].setValue(null);
    this.formGroup.controls['tipo_base'].setValue(null);
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

  onSubmit({ value, valid, dirty }: { value: IParametro, valid: boolean, dirty: boolean }): void {
    this.submitted = true;
    let aux_valid = valid && (value['tipo_base'] || value['tipo_base_default']);
    if(!aux_valid){
      this.growlMessagesService.newMessage({severity:'warn', summary: 'Atención', detail:'El formulario contiene errores.'});
    } else {
      if (dirty){
        this.objetoService.createOrUpdateObjeto(value, TIPOS.CONFIG[TIPOS.PARAMETRO].api_reference)
          .then(obj => {
            this.objeto = obj;
            this.growlMessagesService.newMessage({severity:'success', summary: 'OK', detail:'Objeto guardado correctamente.'});
            this.objetoStreamService.updateMap(this.objetos.withMutations(map => {
              let padre: IOperacionSistema = map.get(this.objetoPadreId);
              let hijo_index = padre[TIPOS.CONFIG[TIPOS.PARAMETRO].related_name].findIndex(dat => obj.id === dat.id);

              if(hijo_index > -1){
                padre[TIPOS.CONFIG[TIPOS.PARAMETRO].related_name].splice(hijo_index, 1, obj);
              } else {
                padre[TIPOS.CONFIG[TIPOS.PARAMETRO].related_name].push(obj);
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
