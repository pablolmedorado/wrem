import { Component, OnInit, OnDestroy, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { TabsetComponent } from 'ngx-bootstrap';

import { Map } from 'immutable';
import * as moment from 'moment';

import { IObjeto } from '../../../objetos/shared/models/objeto.model';
import { ITipoObjeto, TipoObjeto } from '../../../objetos/shared/models/tipo-objeto.model';

import { ObjetoService } from '../../shared/services/objeto.service';
import { ObjetoStreamService } from '../../shared/services/objeto-stream.service';
import { GrowlMessagesService } from '../../shared/services/growl-messages.service';

import { objetoNumeroComparator, paddy } from '../../shared/utils';
import * as TIPOS from '../../shared/tipos';
import { ISelectOption, TIPOS_ESPECIALIZACION } from '../../shared/selects';

@Component({
  selector: 'app-tipo-objeto-form',
  templateUrl: './tipo-objeto-form.component.html',
  styleUrls: ['./tipo-objeto-form.component.css'],
  exportAs: 'TipoObjetoForm'
})
export class TipoObjetoFormComponent implements OnInit, OnDestroy {
  @Input() objetoId: number;
  @Input() documentoId: number;

  objeto: TipoObjeto;
  private objetos: Map<number, any>;
  private objetosSubscription: Subscription;

  // Formulario
  formGroup: FormGroup;
  private submitted: boolean = false;
  @ViewChild('TipoObjetoForm') form;
  @Output() onSubmittedForm = new EventEmitter();

  private max_num: number;
  private readonly tipos_especializacion: ISelectOption[] = TIPOS_ESPECIALIZACION;
  private tiposOptions: IObjeto[];
  private tiene_subtipos: boolean = false;
  private subtipos: ITipoObjeto[];

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
        .filter(obj => obj.tipo_objeto === TIPOS.TIPO_OBJETOS && obj.id !== this.objetoId)
        .toArray();
    });
    
    this.formGroup = this.fb.group({
      id: null,
      documento: [this.documentoId, Validators.required],
      es_abstracto: false,
      supertipo: null,
      subtipo: { value: 'D', disabled: true },
      descripcion: ''
    });

    if(this.objetoId){
      this.objetoService.getObjeto(this.objetoId, {expand: 'logs'})
        .then(objeto => {
          this.objeto = objeto;
          this.formGroup.controls['id'].setValue(this.objeto.id);
          this.formGroup.controls['es_abstracto'].setValue(this.objeto.es_abstracto);
          this.formGroup.controls['supertipo'].setValue(this.objeto.supertipo);
          this.formGroup.controls['subtipo'].setValue(this.objeto.subtipo);
          this.formGroup.controls['descripcion'].setValue(this.objeto.descripcion);

          this.subtipos = this.objetos.filter((obj: ITipoObjeto) => obj.tipo_objeto === TIPOS.TIPO_OBJETOS && obj.supertipo === this.objetoId).toArray();
          this.tiene_subtipos = this.subtipos.length > 0;
          if(this.tiene_subtipos){
            this.formGroup.controls['subtipo'].enable();
          }
        });
    } else {
      let max_obj = this.objetos.filter(obj => obj.tipo_objeto === TIPOS.TIPO_OBJETOS).max(objetoNumeroComparator);
      let num: number = max_obj ? max_obj.numero + 1 : 1;
      let codigo: string = `${TIPOS.CONFIG[TIPOS.TIPO_OBJETOS].prefix}-${paddy(num, 4)}`;
      this.objeto = new TipoObjeto({documento: this.documentoId, codigo: codigo, numero: num});
    }
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.objetosSubscription.unsubscribe();
  }

  onSubmit({ value, valid, dirty }: { value: ITipoObjeto, valid: boolean, dirty: boolean }): void {
    this.submitted = true;
    if(!valid){
      this.growlMessagesService.newMessage({severity:'warn', summary: this.objeto.codigo, detail:'El formulario contiene errores.'});
    } else {
      if (dirty){
        if(value['fecha_version']){
          value['fecha_version'] = moment((<any>value['fecha_version']).jsdate).format('YYYY-MM-DD');
        }
        this.objetoService.createOrUpdateObjeto(value, TIPOS.CONFIG[TIPOS.TIPO_OBJETOS].api_reference)
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
