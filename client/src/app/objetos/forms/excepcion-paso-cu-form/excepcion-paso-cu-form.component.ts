import { Component, OnInit, OnDestroy, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { TabsetComponent } from 'ngx-bootstrap';

import { Map } from 'immutable';

import { IObjeto } from '../../../objetos/shared/models/objeto.model';
import { IExcepcionPasoCU, ExcepcionPasoCU, ICasoUso, IPasoCU } from '../../../objetos/shared/models/caso-uso.model';

import { ObjetoService } from '../../shared/services/objeto.service';
import { ObjetoStreamService } from '../../shared/services/objeto-stream.service';
import { GrowlMessagesService } from '../../shared/services/growl-messages.service';

import * as TIPOS from '../../shared/tipos';
import { ISelectOption, TIPOS_UNIDADES_TIEMPO, TIPOS_TERMINACION } from '../../shared/selects';

@Component({
  selector: 'app-excepcion-paso-cu-form',
  templateUrl: './excepcion-paso-cu-form.component.html',
  styleUrls: ['./excepcion-paso-cu-form.component.css'],
  exportAs: 'ExcepcionPasoCUForm'
})
export class ExcepcionPasoCuFormComponent implements OnInit, OnDestroy {
  @Input() objetoId: number;
  @Input() objetoPadreId: number;
  @Input() objetoAbueloId: number;

  objeto: ExcepcionPasoCU;
  private objetos: Map<number, any>;
  private objetosSubscription: Subscription;

  // Formulario
  formGroup: FormGroup;
  private submitted: boolean = false;
  @ViewChild('ExcepcionPasoCUForm') form;
  @Output() onSubmittedForm = new EventEmitter();

  private readonly tipos_unidades_tiempo: ISelectOption[] = TIPOS_UNIDADES_TIEMPO;
  private readonly tipos_terminacion: ISelectOption[] = TIPOS_TERMINACION;
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
        .filter(obj => obj.tipo_objeto === TIPOS.CASO_USO && obj.id !== this.objetoAbueloId)
        .toArray();
    });
    
    this.formGroup = this.fb.group({
      id: null,
      paso: [this.objetoPadreId, Validators.required],
      condicion: '',
      terminacion: ['PD', Validators.required],
      tipo_accion: ['S', Validators.required],
      actor: { value: null, disabled: true },
      inclusion_extension: { value: null, disabled: true },
      acciones_realizadas: '',
      rendimiento: [0, Validators.min(0)],
      rendimiento_ud: ['PD', Validators.required],
      comentarios: ''
    });

    if(this.objetoId){
      this.objetoService.getElement(this.objetoId, TIPOS.CONFIG[TIPOS.EXCEPCION_PASO_CASO_USO].api_reference)
        .then(objeto => {
          this.objeto = objeto;
          this.objetoPadreId = objeto.paso;
          this.formGroup.controls['id'].setValue(this.objeto.id);
          this.formGroup.controls['paso'].setValue(this.objeto.paso);
          this.formGroup.controls['condicion'].setValue(this.objeto.condicion);
          this.formGroup.controls['terminacion'].setValue(this.objeto.terminacion);
          this.formGroup.controls['actor'].setValue(this.objeto.actor);
          this.formGroup.controls['inclusion_extension'].setValue(this.objeto.inclusion_extension);
          this.formGroup.controls['acciones_realizadas'].setValue(this.objeto.acciones_realizadas);
          this.formGroup.controls['rendimiento'].setValue(this.objeto.rendimiento);
          this.formGroup.controls['rendimiento_ud'].setValue(this.objeto.rendimiento_ud);
          this.formGroup.controls['comentarios'].setValue(this.objeto.comentarios);

          this.formGroup.controls['tipo_accion'].setValue(this.objeto.tipo_accion);
          this.enableDisableTiposAccion();
        });
    } else {
      this.objeto = new ExcepcionPasoCU({ paso: this.objetoPadreId });
    }
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.objetosSubscription.unsubscribe();
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

  onSubmit({ value, valid, dirty }: { value: IExcepcionPasoCU, valid: boolean, dirty: boolean }): void {
    this.submitted = true;
    if(!valid){
      this.growlMessagesService.newMessage({severity:'warn', summary: 'Atención', detail:'El formulario contiene errores.'});
    } else {
      if (dirty){
        this.objetoService.createOrUpdateObjeto(value, TIPOS.CONFIG[TIPOS.EXCEPCION_PASO_CASO_USO].api_reference)
          .then(obj => {
            this.objeto = obj;
            this.growlMessagesService.newMessage({severity:'success', summary: 'OK', detail:'Objeto guardado correctamente.'});
            this.objetoStreamService.updateMap(this.objetos.withMutations(map => {
              let abuelo: ICasoUso = map.get(this.objetoAbueloId);
              let padre: IPasoCU = abuelo.pasos.find(paso => paso.id === this.objetoPadreId);
              let dat_index = padre.excepciones.findIndex(dat => obj.id === dat.id);

              if(dat_index > -1){
                padre.excepciones.splice(dat_index, 1, obj);
              } else {
                padre.excepciones.push(obj);
              }
              map.delete(this.objetoAbueloId).set(this.objetoAbueloId, abuelo);
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
