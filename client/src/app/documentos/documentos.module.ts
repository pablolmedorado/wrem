import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

// Ngx Bootstrap
import { AlertModule } from 'ngx-bootstrap/alert';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { GrowlModule } from 'primeng/primeng';

import { DocumentosRoutingModule } from './documentos-routing.module';

import { DocumentoComponent } from './documento/documento.component';
import { DocumentoListComponent } from './documento-list/documento-list.component';
import { DocumentoService } from './shared/documento.service';
import { DocumentoFormComponent } from './documento-form/documento-form.component';

import { ObjetosModule } from '../objetos/objetos.module';
import { DocumentoHeaderComponent } from './documento-header/documento-header.component';

@NgModule({
  imports: [
    SharedModule,

    AlertModule,
    ModalModule,
    TypeaheadModule,
    PaginationModule,
    TooltipModule,

    GrowlModule,

    ObjetosModule,
    
    DocumentosRoutingModule
  ],
  declarations: [DocumentoComponent, DocumentoListComponent, DocumentoFormComponent, DocumentoHeaderComponent],
  exports: [DocumentoComponent, DocumentoListComponent, DocumentoFormComponent, DocumentoHeaderComponent],
  providers: [DocumentoService]
})
export class DocumentosModule { }
