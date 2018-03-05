import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Map } from 'immutable';

import { ObjetoStreamService } from '../../shared/services/objeto-stream.service';

import { IObjeto } from '../../shared/models/objeto.model';
import { IParticipante } from '../../shared/models/participante.model';
import { ICasoUso, IPasoCU, IExcepcionPasoCU } from '../../shared/models/caso-uso.model';

import * as TIPOS from '../../shared/tipos';

import {
  TIPOS_UNIDADES_TIEMPO, TIPOS_IMPORTANCIA, TIPOS_URGENCIA, TIPOS_ESTABILIDAD, TIPOS_ESTADO_DESARROLLO , TIPOS_TERMINACION
} from '../../shared/choices';

interface IRendimiento {
  paso: number;
  rendimiento: number;
  rendimiento_ud: string;
}

@Component({
  selector: 'app-caso-uso-representation',
  templateUrl: './caso-uso-representation.component.html',
  styleUrls: ['./caso-uso-representation.component.css']
})
export class CasoUsoRepresentationComponent implements OnInit, OnDestroy {
  @Input() caso: ICasoUso;

  private excepciones: IExcepcionPasoCU[];
  private rendimientos: IRendimiento[];
  
  private objetosSubscription: Subscription;
  private objetos: Map<number, any>;
  /*private autores: IParticipante[];
  private fuentes: IParticipante[];
  private dependencias: IObjeto[];*/

  /*private actores: any = {};
  private casos_uso: any = {};*/

  private menciones: ICasoUso[];

  private readonly tipos_unidades_tiempo = TIPOS_UNIDADES_TIEMPO;
  private readonly tipos_importancia = TIPOS_IMPORTANCIA;
  private readonly tipos_urgencia = TIPOS_URGENCIA;
  private readonly tipos_estado_desarrollo = TIPOS_ESTADO_DESARROLLO;
  private readonly tipos_estabilidad = TIPOS_ESTABILIDAD;
  private readonly tipos_terminacion = TIPOS_TERMINACION;

  constructor(private objetoStreamService: ObjetoStreamService) { }

  ngOnInit() {
    this.objetosSubscription = this.objetoStreamService.objetosMap$.subscribe(map => {
      this.objetos = map;

      this.rendimientos = this.caso.pasos.filter(paso => paso.tipo_accion === 'S' && paso.rendimiento > 0).map(paso => {
        return {paso: paso.order, rendimiento: paso.rendimiento, rendimiento_ud: paso.rendimiento_ud};
      });

      let excep: IExcepcionPasoCU[] = [];
      this.caso.pasos.filter(paso => paso.excepciones).forEach(paso => {
        excep.push(...paso.excepciones.map(excepcion => Object.assign({numero_paso: paso.order}, excepcion)));
      });
      this.excepciones = excep;

      this.menciones = this.objetos.filter((obj: ICasoUso) =>
        obj.tipo_objeto === TIPOS.CASO_USO &&
        obj.pasos.some(paso =>
          paso.inclusion_extension === this.caso.id ||
          paso.excepciones.some(excep => excep.inclusion_extension === this.caso.id)
        ) 
      ).toArray();

      /*this.caso.pasos.forEach(paso => {
        if(paso.actor) this.actores[paso.actor] = map.get(paso.actor);
        if(paso.inclusion_extension) this.casos_uso[paso.inclusion_extension] = map.get(paso.inclusion_extension);
      });
      this.excepciones.forEach(excep => {
        if(excep.actor) this.actores[excep.actor] = map.get(excep.actor);
        if(excep.inclusion_extension) this.casos_uso[excep.inclusion_extension] = map.get(excep.inclusion_extension);
      });*/

      /*if(this.caso.autores.length){
        this.autores = map.filter(
          (autor: IParticipante) => autor.tipo_objeto === TIPOS.PARTICIPANTE && this.caso.autores.includes(autor.id)
        ).toArray();
      }
      if(this.caso.fuentes.length){
        this.fuentes = map.filter(
          (fuente: IParticipante) => fuente.tipo_objeto === TIPOS.PARTICIPANTE && this.caso.fuentes.includes(fuente.id)
        ).toArray();
      }
      if(this.caso.trazabilidad_desde.length){
        this.dependencias = map.filter(
          (dep: IObjeto) => TIPOS.TIPOS_TRAZABLES.includes(dep.tipo_objeto) && this.caso.trazabilidad_desde.includes(dep.id)
        ).toArray();
      }*/
    });
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.objetosSubscription.unsubscribe();
  }

}
