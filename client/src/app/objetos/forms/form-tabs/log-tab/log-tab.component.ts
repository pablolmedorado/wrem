import { Component, OnInit, Input } from '@angular/core';

import { IObjeto } from '../../../../objetos/shared/models/objeto.model';

@Component({
  selector: 'app-log-tab',
  templateUrl: './log-tab.component.html',
  styleUrls: ['./log-tab.component.css']
})
export class LogTabComponent implements OnInit {
  @Input() objeto: IObjeto;

  constructor() { }

  ngOnInit() {
  }

}
