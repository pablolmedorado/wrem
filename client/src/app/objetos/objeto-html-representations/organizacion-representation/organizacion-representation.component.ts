import { Component, OnInit, Input } from '@angular/core';

import { IOrganizacion } from '../../shared/models/organizacion.model';

@Component({
  selector: 'app-organizacion-representation',
  templateUrl: './organizacion-representation.component.html',
  styleUrls: ['./organizacion-representation.component.css']
})
export class OrganizacionRepresentationComponent implements OnInit {
  @Input() organizacion: IOrganizacion;

  constructor() { }

  ngOnInit() {
  }

}
