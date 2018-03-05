import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Map } from 'immutable';

import { ObjetoStreamService } from '../../shared/services/objeto-stream.service';

import { IRequisito } from '../../shared/models/requisito.model';

import * as TIPOS from '../../shared/tipos';

import {
  TIPOS_IMPORTANCIA, TIPOS_URGENCIA, TIPOS_ESTABILIDAD, TIPOS_ESTADO_DESARROLLO 
} from '../../shared/choices';

@Component({
  selector: 'app-requisito-representation',
  templateUrl: './requisito-representation.component.html',
  styleUrls: ['./requisito-representation.component.css']
})
export class RequisitoRepresentationComponent implements OnInit, OnDestroy {
  @Input() requisito: IRequisito;

  private objetosSubscription: Subscription;
  private objetos: Map<number, any>;

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
