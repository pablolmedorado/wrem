import { Component, OnInit, OnDestroy, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { TabsetComponent } from 'ngx-bootstrap';

import { Map } from 'immutable';
import * as moment from 'moment';

import { IObjeto } from '../../../objetos/shared/models/objeto.model';
import { IOrganizacion, Organizacion } from '../../../objetos/shared/models/organizacion.model';

import { ObjetoService } from '../../shared/services/objeto.service';
import { ObjetoStreamService } from '../../shared/services/objeto-stream.service';
import { GrowlMessagesService } from '../../shared/services/growl-messages.service';

import { objetoNumeroComparator, paddy } from '../../shared/utils';
import * as TIPOS from '../../shared/tipos';

@Component({
  selector: 'app-organizacion-form',
  templateUrl: './organizacion-form.component.html',
  styleUrls: ['./organizacion-form.component.css'],
  exportAs: 'OrganizacionForm'
})
export class OrganizacionFormComponent implements OnInit, OnDestroy {
  @Input() objetoId: number;
  @Input() documentoId: number;

  objeto: Organizacion;
  private objetos: Map<number, any>;
  private objetosSubscription: Subscription;

  // Formulario
  formGroup: FormGroup;
  private submitted: boolean = false;
  @ViewChild('OrganizacionForm') form;
  @Output() onSubmittedForm = new EventEmitter();

  private max_num: number;
  private participantes_asociados: IObjeto[];

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
      documento: [this.documentoId, Validators.required],
      telefono: '',
      direccion: '',
      email: ''
    });

    if(this.objetoId){
      this.objetoService.getObjeto(this.objetoId, {expand: 'logs'})
        .then(objeto => {
          this.objeto = objeto;
          this.formGroup.controls['id'].setValue(this.objeto.id);
          this.formGroup.controls['telefono'].setValue(this.objeto.telefono);
          this.formGroup.controls['direccion'].setValue(this.objeto.direccion);
          this.formGroup.controls['email'].setValue(this.objeto.email);

          this.participantes_asociados = this.objetos
            .filter(obj => obj.tipo_objeto === TIPOS.PARTICIPANTE && obj.organizacion === this.objeto.id)
            .toArray();
        });
    }else{
      let max_obj = this.objetos.filter(obj => obj.tipo_objeto === TIPOS.ORGANIZACION).max(objetoNumeroComparator);
      let num: number = max_obj ? max_obj.numero + 1 : 1;
      let codigo: string = `${TIPOS.CONFIG[TIPOS.ORGANIZACION].prefix}-${paddy(num, 4)}`;
      this.objeto = new Organizacion({documento: this.documentoId, codigo: codigo, numero: num});
    }
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.objetosSubscription.unsubscribe();
  }

  onSubmit({ value, valid, dirty }: { value: IOrganizacion, valid: boolean, dirty: boolean }): void {
    this.submitted = true;
    if(!valid){
      this.growlMessagesService.newMessage({severity:'warn', summary: this.objeto.codigo, detail:'El formulario contiene errores.'});
    } else {
      if (dirty){
        if(value['fecha_version']){
          value['fecha_version'] = moment((<any>value['fecha_version']).jsdate).format('YYYY-MM-DD');
        }
        this.objetoService.createOrUpdateObjeto(value, TIPOS.CONFIG[TIPOS.ORGANIZACION].api_reference)
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
