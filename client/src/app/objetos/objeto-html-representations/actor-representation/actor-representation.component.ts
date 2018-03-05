import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Map } from 'immutable';

import { ObjetoStreamService } from '../../shared/services/objeto-stream.service';

import { IActor } from '../../shared/models/actor.model';

import * as TIPOS from '../../shared/tipos';

@Component({
  selector: 'app-actor-representation',
  templateUrl: './actor-representation.component.html',
  styleUrls: ['./actor-representation.component.css']
})
export class ActorRepresentationComponent implements OnInit, OnDestroy {
  @Input() actor: IActor;

  private objetosSubscription: Subscription;
  private objetos: Map<number, any>;

  constructor(private objetoStreamService: ObjetoStreamService) { }

  ngOnInit() {
    this.objetosSubscription = this.objetoStreamService.objetosMap$.subscribe(map => this.objetos = map);
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.objetosSubscription.unsubscribe();
  }

}
