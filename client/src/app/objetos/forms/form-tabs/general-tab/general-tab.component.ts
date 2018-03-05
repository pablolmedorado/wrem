import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { INgxMyDpOptions, IMyDateModel } from 'ngx-mydatepicker';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';

import { Map } from 'immutable';

import { IObjeto } from '../../../../objetos/shared/models/objeto.model';
import { ObjetoStreamService } from '../../../shared/services/objeto-stream.service';

import { MULTISELECT_SETTINGS, MULTISELECT_PARTICIPANTES_TEXTS, DATEPICKER_OPTIONS } from '../../../shared/config';
import * as TIPOS from '../../../shared/tipos';

@Component({
  selector: 'app-general-tab',
  templateUrl: './general-tab.component.html',
  styleUrls: ['./general-tab.component.css']
})
export class GeneralTabComponent implements OnInit, OnDestroy {
  @Input() objeto: IObjeto;
  @Input() formGroup: FormGroup;
  @Input() submitted: boolean;

  private objetosSubscription: Subscription;

  // Datepicker config
  readonly versionDateOptions: INgxMyDpOptions = DATEPICKER_OPTIONS;

  // Multiselect config
  participantesOptions: IMultiSelectOption[] = [];
  readonly multiselectSettings: IMultiSelectSettings = MULTISELECT_SETTINGS;
  readonly multiselectParticipantesTexts: IMultiSelectTexts = MULTISELECT_PARTICIPANTES_TEXTS;

  constructor(private objetoStreamService: ObjetoStreamService) { }

  ngOnInit() {
    this.objetosSubscription = this.objetoStreamService.objetosMap$.subscribe(map => {
      this.participantesOptions = map.filter(obj => obj.tipo_objeto === TIPOS.PARTICIPANTE)
        .toArray()
        .map(obj => {return {id: obj.id, name: `${obj.codigo} ${obj.nombre}`}});
    });

    this.formGroup.addControl('codigo', new FormControl({value: this.objeto.codigo, disabled: true}, Validators.required));
    this.formGroup.addControl('nombre', new FormControl(this.objeto.nombre, Validators.required));
    this.formGroup.addControl('version', new FormControl(this.objeto.version, [Validators.required, Validators.pattern('\\d+.\\d+(.\\d+)?')]));

    this.formGroup.addControl('autores', new FormControl(this.objeto.autores));
    this.formGroup.addControl('fuentes', new FormControl(this.objeto.fuentes));

    let fecha_version = { jsdate: this.objeto.fecha_version ? new Date(<string>this.objeto.fecha_version) : new Date() };
    this.formGroup.addControl('fecha_version', new FormControl(fecha_version, Validators.required));
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.objetosSubscription.unsubscribe();
  }

}
