import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Map } from 'immutable';

import { ObjetoStreamService } from '../../shared/services/objeto-stream.service';

import { IAsociacion } from '../../shared/models/asociacion.model';

import * as TIPOS from '../../shared/tipos';
import { TIPOS_COMPONENTE, TIPOS_PROPIEDAD } from '../../shared/choices';

@Component({
  selector: 'app-asociacion-representation',
  templateUrl: './asociacion-representation.component.html',
  styleUrls: ['./asociacion-representation.component.css']
})
export class AsociacionRepresentationComponent implements OnInit, OnDestroy {
  @Input() asociacion: IAsociacion;

  private objetos: Map<number, any>;

  private objetosSubscription: Subscription;
  private tiposBaseSubscription: Subscription;
  private tipos_base: TIPOS.ITipoBase[];

  private readonly tipos_componente = TIPOS_COMPONENTE;
  private readonly tipos_propiedad = TIPOS_PROPIEDAD;

  constructor(private objetoStreamService: ObjetoStreamService) { }

  ngOnInit() {
    this.objetosSubscription = this.objetoStreamService.objetosMap$.subscribe(map => this.objetos = map);
    this.tiposBaseSubscription = this.objetoStreamService.tiposBase$.subscribe(tipos => this.tipos_base = tipos);
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.objetosSubscription.unsubscribe();
    this.tiposBaseSubscription.unsubscribe();
  }

}
