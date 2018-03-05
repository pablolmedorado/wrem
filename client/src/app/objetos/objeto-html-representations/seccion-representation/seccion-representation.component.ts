import { Component, OnInit, Input } from '@angular/core';

import { ISeccion } from '../../shared/models/seccion.model';

@Component({
  selector: 'app-seccion-representation',
  templateUrl: './seccion-representation.component.html',
  styleUrls: ['./seccion-representation.component.css']
})
export class SeccionRepresentationComponent implements OnInit {
  @Input() seccion: ISeccion;

  constructor() { }

  ngOnInit() {
  }

}
