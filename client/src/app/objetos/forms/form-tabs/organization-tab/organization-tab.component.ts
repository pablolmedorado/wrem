import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { Map } from 'immutable';

import { IObjeto } from '../../../../objetos/shared/models/objeto.model';
import { ObjetoService } from '../../../shared/services/objeto.service';
import { ObjetoStreamService } from '../../../shared/services/objeto-stream.service';
import { GrowlMessagesService } from '../../../shared/services/growl-messages.service';

import * as TIPOS from '../../../shared/tipos';

@Component({
  selector: 'app-organization-tab',
  templateUrl: './organization-tab.component.html',
  styleUrls: ['./organization-tab.component.css']
})
export class OrganizationTabComponent implements OnInit, OnDestroy {
  @Input() objeto: IObjeto;
  @Input() documentoId: number;
  @Input() formGroup: FormGroup;

  objetos: Map<number, any>;
  private objetosSubscription: Subscription;

  private seccionesOptions: IObjeto[];
  private seccion_destino: number = null;  

  constructor(
    private objetoService: ObjetoService,
    private objetoStreamService: ObjetoStreamService,
    private growlMessagesService: GrowlMessagesService
  ) { }

  ngOnInit() {
    this.objetosSubscription = this.objetoStreamService.objetosMap$.subscribe(map => {
      this.objetos = map;
      this.seccionesOptions = map
      .filter(obj => obj.tipo_objeto === TIPOS.SECCION && obj.documento === this.documentoId)
      .toArray();
    });
    if(!this.objeto.id){
      this.formGroup.addControl('seccion', new FormControl(this.objeto.seccion));
    }
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.objetosSubscription.unsubscribe();
  }

  changeSeccion(seccion: number): void {
    this.objetoService.changeSeccion(this.objeto.id, seccion)
      .then(obj => {
        this.objeto.seccion = obj.seccion;
        this.objeto.order = obj.order;
        this.growlMessagesService.newMessage({severity:'success', summary: this.objeto.codigo, detail:'Cambio de seccion realizado con éxito.'});
        
        this.objetoStreamService.updateMap(this.objetos.withMutations(map => {
          let objeto_movido = map.get(obj.id);
          map
            .filter(obj => obj.seccion === objeto_movido.seccion && obj.order > objeto_movido.order)
            .toArray()
            .forEach(obj => { obj.order -= 1; map.set(obj.id, obj); });
          map.delete(obj.id);
          map.set(obj.id, obj);
        }));
      })
      .catch(error => {
        this.growlMessagesService.newMessage({severity:'error', summary: this.objeto.codigo, detail:'Error al cambiar de sección.'})
      });
  }

}
