import { Component, OnInit, Input } from '@angular/core';

import { IImagen } from '../../shared/models/imagen.model';

@Component({
  selector: 'app-imagen-representation',
  templateUrl: './imagen-representation.component.html',
  styleUrls: ['./imagen-representation.component.css']
})
export class ImagenRepresentationComponent implements OnInit {
  @Input() imagen: IImagen;

  constructor() { }

  ngOnInit() {
  }

}
