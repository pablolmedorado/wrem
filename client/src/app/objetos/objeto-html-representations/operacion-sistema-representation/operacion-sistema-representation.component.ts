import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Map } from 'immutable';

import { ObjetoStreamService } from '../../shared/services/objeto-stream.service';

import { IOperacionSistema } from '../../shared/models/operacion-sistema.model';
import { IExpresion } from '../../shared/models/expresion.model';

import * as TIPOS from '../../shared/tipos';

@Component({
  selector: 'app-operacion-sistema-representation',
  templateUrl: './operacion-sistema-representation.component.html',
  styleUrls: ['./operacion-sistema-representation.component.css']
})
export class OperacionSistemaRepresentationComponent implements OnInit, OnDestroy {
  @Input() operacion_sistema: IOperacionSistema;

  private objetos: Map<number, any>;

  private objetosSubscription: Subscription;
  private tiposBaseSubscription: Subscription;
  private tipos_base: TIPOS.ITipoBase[];
  private expresiones_pre: IExpresion[];
  private expresiones_post: IExpresion[];

  constructor(private objetoStreamService: ObjetoStreamService) { }

  ngOnInit() {
    this.objetosSubscription = this.objetoStreamService.objetosMap$.subscribe(map => {
      this.objetos = map;
      this.expresiones_pre = this.operacion_sistema.expresiones.filter(expresion => expresion.tipo==='PRE');
      this.expresiones_post = this.operacion_sistema.expresiones.filter(expresion => expresion.tipo==='POST');
    });
    this.tiposBaseSubscription = this.objetoStreamService.tiposBase$.subscribe(tipos => this.tipos_base = tipos);
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.objetosSubscription.unsubscribe();
    this.tiposBaseSubscription.unsubscribe();
  }

}
