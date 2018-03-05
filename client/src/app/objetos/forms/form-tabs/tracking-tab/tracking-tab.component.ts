import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';

import { Map } from 'immutable';

import { IObjeto } from '../../../../objetos/shared/models/objeto.model';
import { ObjetoStreamService } from '../../../shared/services/objeto-stream.service';

import { MULTISELECT_SETTINGS, MULTISELECT_TRAZABLES_TEXTS } from '../../../shared/config';
import * as TIPOS from '../../../shared/tipos';

@Component({
  selector: 'app-tracking-tab',
  templateUrl: './tracking-tab.component.html',
  styleUrls: ['./tracking-tab.component.css']
})
export class TrackingTabComponent implements OnInit, OnDestroy {
  @Input() objeto: IObjeto;
  @Input() formGroup: FormGroup;

  private objetosSubscription: Subscription;

  // Multiselect config
  trazablesOptions: IMultiSelectOption[] = [];
  readonly multiselectSettings: IMultiSelectSettings = MULTISELECT_SETTINGS;
  readonly multiselectTrazablesTexts: IMultiSelectTexts = MULTISELECT_TRAZABLES_TEXTS;

  constructor(private objetoStreamService: ObjetoStreamService) { }

  ngOnInit() {
    this.objetosSubscription = this.objetoStreamService.objetosMap$.subscribe(map => {
      this.trazablesOptions = map.filter(obj => {
        let es_trazable = TIPOS.TIPOS_TRAZABLES.includes(obj.tipo_objeto);
        return this.objeto.id ? (es_trazable && obj.id !== this.objeto.id) : es_trazable;
      })
      .toArray()
      .map(obj => {return {id: obj.id, name: `${obj.codigo} ${obj.nombre}`}});
    });

    this.formGroup.addControl('trazabilidad_desde', new FormControl(this.objeto.trazabilidad_desde));
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.objetosSubscription.unsubscribe();
  }

}
