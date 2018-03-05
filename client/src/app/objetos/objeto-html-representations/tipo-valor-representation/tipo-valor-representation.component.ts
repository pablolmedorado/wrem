import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Map } from 'immutable';

import { ObjetoStreamService } from '../../shared/services/objeto-stream.service';

import { IObjeto } from '../../shared/models/objeto.model';
import { IParticipante } from '../../shared/models/participante.model';
import { ITipoValor } from '../../shared/models/tipo-valor.model';

import * as TIPOS from '../../shared/tipos';

import { TIPOS_COMPONENTE, TIPOS_PROPIEDAD } from '../../shared/choices';

@Component({
  selector: 'app-tipo-valor-representation',
  templateUrl: './tipo-valor-representation.component.html',
  styleUrls: ['./tipo-valor-representation.component.css']
})
export class TipoValorRepresentationComponent implements OnInit {
  @Input() tipo_valor: ITipoValor;

  private objetos: Map<number, any>;

  private objetosSubscription: Subscription;
  private tiposBaseSubscription: Subscription;
  private tipos_base: TIPOS.ITipoBase[];

  private readonly tipos_componente = TIPOS_COMPONENTE;
  private readonly tipos_propiedad = TIPOS_PROPIEDAD;

  constructor(private objetoStreamService: ObjetoStreamService) { }

  ngOnInit() {
    this.objetosSubscription = this.objetoStreamService.objetosMap$.subscribe(map => {
      this.objetos = map;
    });
    this.tiposBaseSubscription = this.objetoStreamService.tiposBase$.subscribe(tipos => this.tipos_base = tipos);
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.objetosSubscription.unsubscribe();
    this.tiposBaseSubscription.unsubscribe();
  }

}
