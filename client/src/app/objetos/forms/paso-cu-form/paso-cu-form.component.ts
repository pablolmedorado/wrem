import { Component, OnInit, OnDestroy, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { TabsetComponent } from 'ngx-bootstrap';

import { Map } from 'immutable';

import { IObjeto } from '../../../objetos/shared/models/objeto.model';
import { IPasoCU, PasoCU, ICasoUso } from '../../../objetos/shared/models/caso-uso.model';

import { ObjetoService } from '../../shared/services/objeto.service';
import { ObjetoStreamService } from '../../shared/services/objeto-stream.service';
import { GrowlMessagesService } from '../../shared/services/growl-messages.service';

import * as TIPOS from '../../shared/tipos';
import { ISelectOption, TIPOS_UNIDADES_TIEMPO } from '../../shared/selects';

@Component({
  selector: 'app-paso-cu-form',
  templateUrl: './paso-cu-form.component.html',
  styleUrls: ['./paso-cu-form.component.css'],
  exportAs: 'PasoCUForm'
})
export class PasoCuFormComponent implements OnInit, OnDestroy {
  @Input() objetoId: number;
  @Input() objetoPadreId: number;

  objeto: PasoCU;
  private objetos: Map<number, any>;
  private objetosSubscription: Subscription;

  // Formulario
  formGroup: FormGroup;
  private submitted: boolean = false;
  @ViewChild('PasoCUForm') form;
  @Output() onSubmittedForm = new EventEmitter();

  private readonly tipos_unidades_tiempo: ISelectOption[] = TIPOS_UNIDADES_TIEMPO;
  private actoresOptions: IObjeto[];
  private casosUsoOptions: IObjeto[];

  constructor(
    private objetoService: ObjetoService,
    private objetoStreamService: ObjetoStreamService,
    private growlMessagesService: GrowlMessagesService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.objetosSubscription = this.objetoStreamService.objetosMap$.subscribe(map => {
      this.objetos = map;
      this.actoresOptions = map
        .filter(obj => obj.tipo_objeto === TIPOS.ACTOR)
        .toArray();
      this.casosUsoOptions = map
        .filter(obj => obj.tipo_objeto === TIPOS.CASO_USO && obj.id !== this.objetoPadreId)
        .toArray();
    });

    this.formGroup = this.fb.group({
      id: null,
      caso_uso: [this.objetoPadreId, Validators.required],
      es_condicional: false,
      condicion: { value: '', disabled: true },
      tipo_accion: ['S', Validators.required],
      actor: { value: null, disabled: true },
      inclusion_extension: { value: null, disabled: true },
      acciones_realizadas: '',
      rendimiento: [0, Validators.min(0)],
      rendimiento_ud: ['PD', Validators.required],
      comentarios: ''
    });

    if(this.objetoId){
      this.objetoService.getElement(this.objetoId, TIPOS.CONFIG[TIPOS.PASO_CASO_USO].api_reference)
        .then(objeto => {
          this.objeto = objeto;
          this.objetoPadreId = objeto.caso_uso;
          this.formGroup.controls['id'].setValue(this.objeto.id);
          this.formGroup.controls['caso_uso'].setValue(this.objeto.caso_uso);
          this.formGroup.controls['es_condicional'].setValue(this.objeto.es_condicional);
          this.formGroup.controls['condicion'].setValue(this.objeto.condicion);
          this.formGroup.controls['actor'].setValue(this.objeto.actor);
          this.formGroup.controls['inclusion_extension'].setValue(this.objeto.inclusion_extension);
          this.formGroup.controls['acciones_realizadas'].setValue(this.objeto.acciones_realizadas);
          this.formGroup.controls['rendimiento'].setValue(this.objeto.rendimiento);
          this.formGroup.controls['rendimiento_ud'].setValue(this.objeto.rendimiento_ud);
          this.formGroup.controls['comentarios'].setValue(this.objeto.comentarios);

          this.formGroup.controls['tipo_accion'].setValue(this.objeto.tipo_accion);
          this.enableDisableTiposAccion();
          this.enableDisableCondicion();
        });
    } else {
      this.objeto = new PasoCU({ caso_uso: this.objetoPadreId });
    }
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.objetosSubscription.unsubscribe();
  }

  enableDisableCondicion(): void {
    const ctrl = this.formGroup.get('condicion');
    this.formGroup.get('es_condicional').value ? ctrl.enable() : ctrl.disable();
  }

  enableDisableTiposAccion(): void {
    const actor = this.formGroup.get('actor');
    const ie = this.formGroup.get('inclusion_extension');
    const acciones = this.formGroup.get('acciones_realizadas');
    const rendimiento = this.formGroup.get('rendimiento');
    const rendimiento_ud = this.formGroup.get('rendimiento_ud');
    
    switch(this.formGroup.get('tipo_accion').value){
      case 'S':
        actor.disable();
        ie.disable();
        rendimiento.enable();
        rendimiento_ud.enable();
        acciones.enable();
        break;
      case 'M':
        actor.enable();
        ie.disable();
        rendimiento.disable();
        rendimiento_ud.disable();
        acciones.enable();
        break;
      case 'IE':
        actor.disable();
        ie.enable();
        rendimiento.disable();
        rendimiento_ud.disable();
        acciones.disable();
        break;
    }
  }

  onSubmit({ value, valid, dirty }: { value: IPasoCU, valid: boolean, dirty: boolean }): void {
    this.submitted = true;
    if(!valid){
      this.growlMessagesService.newMessage({severity:'warn', summary: 'Atención', detail:'El formulario contiene errores.'});
    } else {
      if (dirty){
        this.objetoService.createOrUpdateObjeto(value, TIPOS.CONFIG[TIPOS.PASO_CASO_USO].api_reference)
          .then(obj => {
            this.objeto = obj;
            this.growlMessagesService.newMessage({severity:'success', summary: 'OK', detail:'Objeto guardado correctamente.'});
            this.objetoStreamService.updateMap(this.objetos.withMutations(map => {
              let padre: ICasoUso = map.get(this.objetoPadreId);
              let hijo_index = padre[TIPOS.CONFIG[TIPOS.PASO_CASO_USO].related_name].findIndex(dat => obj.id === dat.id);

              if(hijo_index > -1){
                padre[TIPOS.CONFIG[TIPOS.PASO_CASO_USO].related_name].splice(hijo_index, 1, obj);
              } else {
                padre[TIPOS.CONFIG[TIPOS.PASO_CASO_USO].related_name].push(obj);
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
