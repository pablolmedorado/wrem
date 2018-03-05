import { NgModule } from '@angular/core';

// Ngx Bootstrap
import { AlertModule } from 'ngx-bootstrap/alert';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';

import { SharedModule } from '../shared/shared.module';

import { GruposRoutingModule } from './grupos-routing.module';
import { GrupoService } from './shared/grupo.service';

import { GrupoListComponent } from './grupo-list/grupo-list.component';
import { GrupoFormComponent } from './grupo-form/grupo-form.component';

@NgModule({
  imports: [
    SharedModule,

    AlertModule,
    ModalModule,
    PaginationModule,
    TooltipModule,

    MultiselectDropdownModule,

    GruposRoutingModule
  ],
  declarations: [
    GrupoListComponent,
    GrupoFormComponent
  ],
  exports: [
    GrupoListComponent,
    GrupoFormComponent
  ],
  providers: [GrupoService]
})
export class GruposModule { }
