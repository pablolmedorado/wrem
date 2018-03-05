import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Map } from 'immutable';

import { ObjetoStreamService } from '../../shared/services/objeto-stream.service';

import { IPeticionCambio } from '../../shared/models/peticion-cambio.model';
import { IObjeto } from '../../shared/models/objeto.model';

import * as TIPOS from '../../shared/tipos';
import { TIPOS_IMPORTANCIA, TIPOS_URGENCIA, TIPOS_ESTADO_PETICION_CAMBIO } from '../../shared/choices';

@Component({
  selector: 'app-peticion-cambio-representation',
  templateUrl: './peticion-cambio-representation.component.html',
  styleUrls: ['./peticion-cambio-representation.component.css']
})
export class PeticionCambioRepresentationComponent implements OnInit, OnDestroy {
  @Input() peticion_cambio: IPeticionCambio;

  private objetos: Map<number, any>;

  private objetosSubscription: Subscription;

  private readonly tipos_importancia = TIPOS_IMPORTANCIA;
  private readonly tipos_urgencia = TIPOS_URGENCIA;
  private readonly tipos_estado = TIPOS_ESTADO_PETICION_CAMBIO;

  private objetos_afectados_directamente: IObjeto[];

  constructor(private objetoStreamService: ObjetoStreamService) { }

  ngOnInit() {
    this.objetosSubscription = this.objetoStreamService.objetosMap$.subscribe(map => {
      this.objetos = map;
      this.objetos_afectados_directamente = map.filter((obj: IObjeto) => obj.trazabilidad_desde.includes(this.peticion_cambio.id)).toArray();
    });
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.objetosSubscription.unsubscribe();
  }

}
