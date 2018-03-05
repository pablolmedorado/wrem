import { Component, OnInit, OnDestroy, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { TabsetComponent } from 'ngx-bootstrap';

import { Map } from 'immutable';
import * as moment from 'moment';

import { IObjeto } from '../../../objetos/shared/models/objeto.model';
import { IImagen, Imagen } from '../../../objetos/shared/models/imagen.model';

import { ObjetoService } from '../../shared/services/objeto.service';
import { ObjetoStreamService } from '../../shared/services/objeto-stream.service';
import { GrowlMessagesService } from '../../shared/services/growl-messages.service';

import { objetoNumeroComparator, paddy } from '../../shared/utils';
import * as TIPOS from '../../shared/tipos';

@Component({
  selector: 'app-imagen-form',
  templateUrl: './imagen-form.component.html',
  styleUrls: ['./imagen-form.component.css'],
  exportAs: 'ImagenForm'
})
export class ImagenFormComponent implements OnInit, OnDestroy {
  @Input() objetoId: number;
  @Input() documentoId: number;

  objeto: Imagen;
  private objetos: Map<number, any>;
  private objetosSubscription: Subscription;

  // Formulario
  formGroup: FormGroup;
  private submitted: boolean = false;
  @ViewChild('ImagenForm') form: NgForm;
  @Output() onSubmittedForm = new EventEmitter();

  private max_num: number;
  private imagen: string;
  private readonly MAX_SIZE: number = 3 * 1048576;
  private show_size_error: boolean = false;
  private show_type_error: boolean = false;

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
      imagen: null
    });

    if(this.objetoId){
      this.objetoService.getObjeto(this.objetoId, {expand: 'logs'})
        .then((objeto: IImagen) => {
          this.objeto = objeto;
          this.formGroup.controls['id'].setValue(this.objeto.id);

          this.imagen = objeto.imagen;
        });
    } else {
      let max_obj = this.objetos.filter(obj => obj.tipo_objeto === TIPOS.IMAGEN).max(objetoNumeroComparator);
      let num: number = max_obj ? max_obj.numero + 1 : 1;
      let codigo: string = `${TIPOS.CONFIG[TIPOS.IMAGEN].prefix}-${paddy(num, 4)}`;
      this.objeto = new Imagen({documento: this.documentoId, codigo: codigo, numero: num});
    }
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.objetosSubscription.unsubscribe();
  }

  onFileChange(event: any) {
    let file: File = event.target.files[0];
    this.show_size_error = (file.size > this.MAX_SIZE);
    this.show_type_error = !(['image/gif', 'image/jpeg', 'image/png'].includes(file.type));
    if(!this.show_size_error && !this.show_type_error){
      this.formGroup.controls['imagen'].setValue(event.target.files[0]);
    }
    this.formGroup.controls['imagen'].markAsDirty();
    this.imagen = null;
  }

  onSubmit({ value, valid, dirty }: { value: IImagen, valid: boolean, dirty: boolean }): void {
    this.submitted = true;
    let aux_valid = valid && (this.formGroup.controls['imagen'].value || this.imagen);
    if(!aux_valid){
      this.growlMessagesService.newMessage({severity:'warn', summary: this.objeto.codigo, detail:'El formulario contiene errores.'});
    } else {
      if (dirty){
        if(value['fecha_version']){
          value['fecha_version'] = moment((<any>value['fecha_version']).jsdate).format('YYYY-MM-DD');
        }
        if(!value['imagen']){
          delete value['imagen'];
        }
        let form_data = new FormData();
        for ( var key in value ) {
          if(value[key] !== null){
            form_data.append(key, value[key]);
          }        
        }
        this.objetoService.uploadImagenForm(value['id'], form_data)
          .then((obj: IImagen) => {
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

