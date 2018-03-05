import { Component, OnInit, OnDestroy, SimpleChange, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import * as _ from 'lodash';
import { Map } from 'immutable';

import { IDocumento } from '../../documentos/shared/documento.model';
import { IObjeto } from '../shared/models/objeto.model';
import { ObjetoStreamService } from '../shared/services/objeto-stream.service';

import { occurrences, objetoComparator } from '../shared/utils';
import * as TIPOS from '../shared/tipos';

interface IObjetoConSeccion extends IObjeto {seccion_id: string};

@Component({
  selector: 'app-objeto-list-html',
  templateUrl: './objeto-list-html.component.html',
  styleUrls: ['./objeto-list-html.component.css']
})
export class ObjetoListHtmlComponent implements OnInit, OnDestroy {
  @Input() documento: IDocumento;

  objetos: Map<number, any>;
  private objetosSubscription: Subscription;
  
  objetos_array : IObjeto[];
  private objetos_por_seccion: {[index: string]: IObjeto[];}
  private secciones_indice: string[];

  constructor(private objetoStreamService: ObjetoStreamService) { }

  ngOnInit() {
    this.objetosSubscription = this.objetoStreamService.objetosMap$.subscribe(map => {
      this.objetos = map;
      this.secciones_indice = [];
      this.objetos_por_seccion = _.groupBy(
        map.filter(objeto => objeto.documento === this.documento.id).toArray(), 'seccion'
      );

      this.objetos_array = this.procesaSeccion('null');
    });
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.objetosSubscription.unsubscribe();
  }

  procesaSeccion(seccion: number|string, seccion_padre?: string): IObjeto[] {
    let objetos_seccion: IObjeto[] = [];

    let contador_secciones_hermanas: number = 0;

    if(this.objetos_por_seccion[seccion]){
      this.objetos_por_seccion[seccion].sort(objetoComparator).forEach(objeto => {
        if(objeto.tipo_objeto === TIPOS.SECCION){
          contador_secciones_hermanas++;
          let objeto_aux = Object.assign(
            {seccion_id: seccion_padre ? `${seccion_padre}.${contador_secciones_hermanas}` : contador_secciones_hermanas.toString()}, objeto
          ) as IObjetoConSeccion;
          objetos_seccion.push(objeto_aux);
          this.secciones_indice.push(
            `${Array(4*occurrences(objeto_aux.seccion_id, '.')).fill('&nbsp;').join('')}${objeto_aux.seccion_id} ${objeto.nombre}`
          );
          objetos_seccion.push(...this.procesaSeccion(objeto_aux.id, objeto_aux.seccion_id));
        } else {
          objetos_seccion.push(objeto);
        }
      });
    }
    return objetos_seccion;
  }

}
