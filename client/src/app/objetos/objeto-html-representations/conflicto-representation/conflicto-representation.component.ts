import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Map } from 'immutable';

import { ObjetoStreamService } from '../../shared/services/objeto-stream.service';

import { IConflicto } from '../../shared/models/conflicto.model';
import { IObjeto } from '../../shared/models/objeto.model';

import * as TIPOS from '../../shared/tipos';
import { TIPOS_IMPORTANCIA, TIPOS_URGENCIA, TIPOS_ESTADO_CONFLICTO } from '../../shared/choices';

@Component({
  selector: 'app-conflicto-representation',
  templateUrl: './conflicto-representation.component.html',
  styleUrls: ['./conflicto-representation.component.css']
})
export class ConflictoRepresentationComponent implements OnInit {
  @Input() conflicto: IConflicto;

  private objetos: Map<number, any>;

  private objetosSubscription: Subscription;

  private readonly tipos_importancia = TIPOS_IMPORTANCIA;
  private readonly tipos_urgencia = TIPOS_URGENCIA;
  private readonly tipos_estado = TIPOS_ESTADO_CONFLICTO;

  private objetos_afectados_directamente: IObjeto[];

  constructor(private objetoStreamService: ObjetoStreamService) { }

  ngOnInit() {
    this.objetosSubscription = this.objetoStreamService.objetosMap$.subscribe(map => {
      this.objetos = map;
      this.objetos_afectados_directamente = map.filter((obj: IObjeto) => obj.trazabilidad_desde.includes(this.conflicto.id)).toArray();
    });
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.objetosSubscription.unsubscribe();
  }

}
