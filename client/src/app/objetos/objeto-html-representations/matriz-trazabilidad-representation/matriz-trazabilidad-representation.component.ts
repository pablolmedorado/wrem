import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Map } from 'immutable';
import * as _ from 'lodash';

import { ObjetoService } from '../../shared/services/objeto.service';
import { ObjetoStreamService } from '../../shared/services/objeto-stream.service';

import { IObjeto } from '../../shared/models/objeto.model';
import { IMatrizTrazabilidad } from '../../shared/models/matriz-trazabilidad.model';

import * as TIPOS from '../../shared/tipos';
import { objetoNumeroComparator } from '../../shared/utils';

@Component({
  selector: 'app-matriz-trazabilidad-representation',
  templateUrl: './matriz-trazabilidad-representation.component.html',
  styleUrls: ['./matriz-trazabilidad-representation.component.css']
})
export class MatrizTrazabilidadRepresentationComponent implements OnInit, OnDestroy {
  @Input() matriz: IMatrizTrazabilidad;

  private objetosSubscription: Subscription;
  private objetos: Map<number, any>;
  private tiposTrazablesSubscription: Subscription;
  private tiposOptions: TIPOS.IObjetoTrazable[];

  objetos_filas: Array<IObjeto>;
  objetos_columnas: Array<IObjeto>;

  constructor(private objetoStreamService: ObjetoStreamService) {
    this.tiposTrazablesSubscription = this.objetoStreamService.tiposTrazables$.subscribe(tipos => {
      this.tiposOptions = tipos;
    });
  }

  ngOnInit() {
    this.objetosSubscription = this.objetoStreamService.objetosMap$.subscribe(map => {
      this.objetos = map;
      this.calcularMatriz();
    });
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.tiposTrazablesSubscription.unsubscribe();
    this.objetosSubscription.unsubscribe();
  }

  calcularMatriz(): void {
    let tipo_filas = this.tiposOptions.find(
      tipo => tipo.id === this.matriz.tipo_filas && tipo.type === this.matriz.subtipo_filas
    );
    let tipo_columnas = this.tiposOptions.find(
      tipo => tipo.id === this.matriz.tipo_columnas && tipo.type === this.matriz.subtipo_columnas
    );

    this.objetos_filas = this.objetos
      .filter((objeto: IObjeto) => objeto.tipo_objeto === tipo_filas.model)
      .toArray()
      .sort(objetoNumeroComparator);
    this.objetos_columnas = this.objetos
      .filter((objeto: IObjeto) => objeto.tipo_objeto === tipo_columnas.model)
      .toArray()
      .sort(objetoNumeroComparator);
  }

}
