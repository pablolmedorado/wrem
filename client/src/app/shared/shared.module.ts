import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { InitDirective } from './init.directive';
import { TinymceComponent } from './tinymce/tinymce.component';
import { SafeHTMLPipe } from './safe-html.pipe';
import { RequeridoDirective } from './requerido.directive';
import { TruncatePipe } from './truncate.pipe';

@NgModule({
  imports: [ CommonModule ],
  declarations: [ InitDirective, TinymceComponent, SafeHTMLPipe, RequeridoDirective, TruncatePipe ],
  exports: [ RequeridoDirective, TruncatePipe, InitDirective, TinymceComponent, SafeHTMLPipe, CommonModule, FormsModule, ReactiveFormsModule ]
})
export class SharedModule { }
