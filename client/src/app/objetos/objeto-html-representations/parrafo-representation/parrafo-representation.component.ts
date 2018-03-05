import { Component, OnInit, Input } from '@angular/core';

import { IParrafo } from '../../shared/models/parrafo.model';

@Component({
  selector: 'app-parrafo-representation',
  templateUrl: './parrafo-representation.component.html',
  styleUrls: ['./parrafo-representation.component.css']
})
export class ParrafoRepresentationComponent implements OnInit {
  @Input() parrafo: IParrafo;

  constructor() { }

  ngOnInit() {
  }

}
