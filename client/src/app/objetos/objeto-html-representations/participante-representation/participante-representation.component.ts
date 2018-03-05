import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Map } from 'immutable';

import { ObjetoStreamService } from '../../shared/services/objeto-stream.service';

import { IParticipante } from '../../shared/models/participante.model';
import { IOrganizacion } from '../../shared/models/organizacion.model';

@Component({
  selector: 'app-participante-representation',
  templateUrl: './participante-representation.component.html',
  styleUrls: ['./participante-representation.component.css']
})
export class ParticipanteRepresentationComponent implements OnInit, OnDestroy {
  @Input() participante: IParticipante;
  
  private objetosSubscription: Subscription;
  private organizacion: IOrganizacion;

  constructor(private objetoStreamService: ObjetoStreamService) { }

  ngOnInit() {
    this.objetosSubscription = this.objetoStreamService.objetosMap$.subscribe(map => {
      this.organizacion = map.get(this.participante.organizacion);
    });
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.objetosSubscription.unsubscribe();
  }

}
