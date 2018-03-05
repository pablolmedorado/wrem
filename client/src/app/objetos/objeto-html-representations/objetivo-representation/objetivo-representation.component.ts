import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Map } from 'immutable';

import { ObjetoStreamService } from '../../shared/services/objeto-stream.service';

import { IObjeto } from '../../shared/models/objeto.model';
import { IObjetivo } from '../../shared/models/objetivo.model';
import { IParticipante } from '../../shared/models/participante.model';
import { TIPOS_IMPORTANCIA, TIPOS_URGENCIA, TIPOS_ESTADO_DESARROLLO, TIPOS_ESTABILIDAD } from '../../shared/choices';
import * as TIPOS from '../../shared/tipos';

@Component({
  selector: 'app-objetivo-representation',
  templateUrl: './objetivo-representation.component.html',
  styleUrls: ['./objetivo-representation.component.css']
})
export class ObjetivoRepresentationComponent implements OnInit {
  @Input() objetivo: IObjetivo;

  private objetosSubscription: Subscription;
  private objetos: Map<number, any>;
  //private autores: IParticipante[];
  //private fuentes: IParticipante[];

  //private importancia: string;
  //private urgencia: string;
  //private estado_desarrollo: string;
  //private estabilidad: string;
  //private padre: IObjetivo;

  private readonly tipos_importancia = TIPOS_IMPORTANCIA;
  private readonly tipos_urgencia = TIPOS_URGENCIA;
  private readonly tipos_estado_desarrollo = TIPOS_ESTADO_DESARROLLO;
  private readonly tipos_estabilidad = TIPOS_ESTABILIDAD;

  constructor(private objetoStreamService: ObjetoStreamService) { }

  ngOnInit() {
    /*this.importancia = TIPOS_IMPORTANCIA[this.objetivo.importancia];
    this.urgencia = TIPOS_URGENCIA[this.objetivo.urgencia];
    this.estado_desarrollo = TIPOS_ESTADO_DESARROLLO[this.objetivo.estado_desarrollo];
    this.estabilidad = TIPOS_ESTABILIDAD[this.objetivo.estabilidad];*/

    this.objetosSubscription = this.objetoStreamService.objetosMap$.subscribe(map => {
      this.objetos = map;
      /*this.padre = this.objetivo.padre ? map.get(this.objetivo.padre) : null;
      if(this.objetivo.autores.length){
        this.autores = map.filter(
          (autor: IParticipante) => autor.tipo_objeto === TIPOS.PARTICIPANTE && this.objetivo.autores.includes(autor.id)
        ).toArray();
      }
      if(this.objetivo.fuentes.length){
        this.fuentes = map.filter(
          (fuente: IParticipante) => fuente.tipo_objeto === TIPOS.PARTICIPANTE && this.objetivo.fuentes.includes(fuente.id)
        ).toArray();
      }*/
    });
  }

}
