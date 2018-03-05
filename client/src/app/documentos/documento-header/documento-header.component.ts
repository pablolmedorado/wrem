import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Map } from 'immutable';

import { IDocumento } from '../shared/documento.model';
import { IObjeto } from '../../objetos/shared/models/objeto.model';
import { ObjetoStreamService } from '../../objetos/shared/services/objeto-stream.service';

@Component({
  selector: 'app-documento-header',
  templateUrl: './documento-header.component.html',
  styleUrls: ['./documento-header.component.css']
})
export class DocumentoHeaderComponent implements OnInit, OnDestroy {
  @Input() documento: IDocumento;

  objetos: Map<number, any>;
  private objetosSubscription: Subscription;

  organizacionPorDocumento: IObjeto;
  organizacionParaDocumento: IObjeto;

  constructor(private objetoStreamService: ObjetoStreamService) { }

  ngOnInit() {
    this.objetosSubscription = this.objetoStreamService.objetosMap$.subscribe(map => {
      this.organizacionPorDocumento = map.get(this.documento.organizacion_por);
      this.organizacionParaDocumento = map.get(this.documento.organizacion_para);
    });
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.objetosSubscription.unsubscribe();
  }

}
