import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Map } from 'immutable';

import { ObjetoStreamService } from '../../shared/services/objeto-stream.service';

import { IObjeto } from '../../shared/models/objeto.model';
import { IParticipante } from '../../shared/models/participante.model';
import { IReunion } from '../../shared/models/reunion.model';

import * as TIPOS from '../../shared/tipos';

@Component({
  selector: 'app-reunion-representation',
  templateUrl: './reunion-representation.component.html',
  styleUrls: ['./reunion-representation.component.css']
})
export class ReunionRepresentationComponent implements OnInit, OnDestroy {
  @Input() reunion: IReunion;

  private objetosSubscription: Subscription;
  private objetos: Map<number, any>;

  constructor(private objetoStreamService: ObjetoStreamService) { }

  ngOnInit() {
    this.objetosSubscription = this.objetoStreamService.objetosMap$.subscribe(map => {
      this.objetos = map;
    });
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.objetosSubscription.unsubscribe();
  }

}
