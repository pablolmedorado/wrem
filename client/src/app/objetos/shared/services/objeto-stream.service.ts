import { Injectable } from '@angular/core';
import { BehaviorSubject }    from 'rxjs/BehaviorSubject';

import { Map } from 'immutable';

import { IObjeto } from '../models/objeto.model';

import * as TIPOS from '../tipos';

@Injectable()
export class ObjetoStreamService {

  private objetosMap = new BehaviorSubject<Map<number, any>>(Map<number, any>());
  objetosMap$ = this.objetosMap.asObservable();

  private tiposTrazables = new BehaviorSubject<TIPOS.IObjetoTrazable[]>([]);
  tiposTrazables$ = this.tiposTrazables.asObservable();

  private tiposBase = new BehaviorSubject<TIPOS.ITipoBase[]>([]);
  tiposBase$ = this.tiposBase.asObservable();

  constructor() { }

  updateMap(objetos: Map<number, any>): void{
    this.objetosMap.next(objetos);
  }

  updateTiposTrazables(tipos: TIPOS.IObjetoTrazable[]): void{
    this.tiposTrazables.next(tipos);
  }

  updateTiposBase(tipos: TIPOS.ITipoBase[]): void{
    this.tiposBase.next(tipos);
  }

}
