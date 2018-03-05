import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Map } from 'immutable';

import { ObjetoStreamService } from '../../shared/services/objeto-stream.service';

import { IRequisitoInformacion } from '../../shared/models/requisito-informacion.model';

import * as TIPOS from '../../shared/tipos';

import {
  TIPOS_UNIDADES_TIEMPO, TIPOS_IMPORTANCIA, TIPOS_URGENCIA, TIPOS_ESTABILIDAD, TIPOS_ESTADO_DESARROLLO 
} from '../../shared/choices';

@Component({
  selector: 'app-req-inf-representation',
  templateUrl: './req-inf-representation.component.html',
  styleUrls: ['./req-inf-representation.component.css']
})
export class ReqInfRepresentationComponent implements OnInit, OnDestroy {
  @Input() requisito_informacion: IRequisitoInformacion;

  private objetosSubscription: Subscription;
  private objetos: Map<number, any>;

  private readonly tipos_unidades_tiempo = TIPOS_UNIDADES_TIEMPO;
  private readonly tipos_importancia = TIPOS_IMPORTANCIA;
  private readonly tipos_urgencia = TIPOS_URGENCIA;
  private readonly tipos_estado_desarrollo = TIPOS_ESTADO_DESARROLLO;
  private readonly tipos_estabilidad = TIPOS_ESTABILIDAD;

  constructor(private objetoStreamService: ObjetoStreamService) { }

  ngOnInit() {
    this.objetosSubscription = this.objetoStreamService.objetosMap$.subscribe(map => {
      this.objetos = map;
    });
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.objetosSubscription.unsubscribe();
  }

}
