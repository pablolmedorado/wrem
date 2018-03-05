import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Map } from 'immutable';

import { ObjetoStreamService } from '../../shared/services/objeto-stream.service';

import { ITipoObjeto } from '../../shared/models/tipo-objeto.model';

import * as TIPOS from '../../shared/tipos';
import { TIPOS_COMPONENTE, TIPOS_PROPIEDAD, TIPOS_ESPECIALIZACION } from '../../shared/choices';

@Component({
  selector: 'app-tipo-objeto-representation',
  templateUrl: './tipo-objeto-representation.component.html',
  styleUrls: ['./tipo-objeto-representation.component.css']
})
export class TipoObjetoRepresentationComponent implements OnInit, OnDestroy {
  @Input() tipo_objeto: ITipoObjeto;

  private objetos: Map<number, any>;

  private objetosSubscription: Subscription;
  private tiposBaseSubscription: Subscription;
  private subtipos: ITipoObjeto[];
  private tipos_base: TIPOS.ITipoBase[];

  private readonly tipos_componente = TIPOS_COMPONENTE;
  private readonly tipos_propiedad = TIPOS_PROPIEDAD;
  private readonly tipos_especializacion = TIPOS_ESPECIALIZACION;

  constructor(private objetoStreamService: ObjetoStreamService) { }

  ngOnInit() {
    this.objetosSubscription = this.objetoStreamService.objetosMap$.subscribe(map => {
      this.objetos = map;
      this.subtipos = map.filter((obj: ITipoObjeto) => obj.tipo_objeto === TIPOS.TIPO_OBJETOS && obj.supertipo === this.tipo_objeto.id).toArray();
    });
    this.tiposBaseSubscription = this.objetoStreamService.tiposBase$.subscribe(tipos => this.tipos_base = tipos);
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.objetosSubscription.unsubscribe();
    this.tiposBaseSubscription.unsubscribe();
  }

}
