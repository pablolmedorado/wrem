import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Map } from 'immutable';

import { ObjetoStreamService } from '../../shared/services/objeto-stream.service';

import { IDefecto } from '../../shared/models/defecto.model';
import { IObjeto } from '../../shared/models/objeto.model';

import * as TIPOS from '../../shared/tipos';
import { TIPOS_IMPORTANCIA, TIPOS_URGENCIA, TIPOS_ESTADO_DEFECTO, TIPOS_DEFECTO } from '../../shared/choices';

@Component({
  selector: 'app-defecto-representation',
  templateUrl: './defecto-representation.component.html',
  styleUrls: ['./defecto-representation.component.css']
})
export class DefectoRepresentationComponent implements OnInit, OnDestroy {
  @Input() defecto: IDefecto;

  private objetos: Map<number, any>;

  private objetosSubscription: Subscription;

  private readonly tipos_importancia = TIPOS_IMPORTANCIA;
  private readonly tipos_urgencia = TIPOS_URGENCIA;
  private readonly tipos_estado = TIPOS_ESTADO_DEFECTO;
  private readonly tipos_defecto = TIPOS_DEFECTO;

  private objetos_afectados_directamente: IObjeto[];

  constructor(private objetoStreamService: ObjetoStreamService) { }

  ngOnInit() {
    this.objetosSubscription = this.objetoStreamService.objetosMap$.subscribe(map => {
      this.objetos = map;
      this.objetos_afectados_directamente = map.filter((obj: IObjeto) => obj.trazabilidad_desde.includes(this.defecto.id)).toArray();
    });
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.objetosSubscription.unsubscribe();
  }

}
