import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { IObjeto } from '../../../../objetos/shared/models/objeto.model';

@Component({
  selector: 'app-comment-tab',
  templateUrl: './comment-tab.component.html',
  styleUrls: ['./comment-tab.component.css']
})
export class CommentTabComponent implements OnInit {
  @Input() objeto: IObjeto;
  @Input() formGroup: FormGroup;
  @Input() submitted: boolean;

  constructor() { }

  ngOnInit() {
    this.formGroup.addControl('comentarios', new FormControl(this.objeto.comentarios));
  }

}
