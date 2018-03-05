import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

// Ngx Bootstrap
import { AlertModule } from 'ngx-bootstrap/alert';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';

import { DocumentosModule } from '../documentos/documentos.module';

import { ProyectosRoutingModule } from './proyectos-routing.module';

import { ProyectoComponent } from './proyecto/proyecto.component';
import { ProyectoListComponent } from './proyecto-list/proyecto-list.component';
import { ProyectoService } from './shared/proyecto.service';
import { ProyectoFormComponent } from './proyecto-form/proyecto-form.component';

@NgModule({
  imports: [
    SharedModule,

    AlertModule,
    ModalModule,
    PaginationModule,
    PopoverModule,
    TooltipModule,
    
    MultiselectDropdownModule,
    
    DocumentosModule,
    
    ProyectosRoutingModule
  ],
  declarations: [ProyectoComponent, ProyectoListComponent, ProyectoFormComponent],
  exports: [ProyectoComponent, ProyectoListComponent, ProyectoFormComponent],
  providers: [ProyectoService]
})
export class ProyectosModule { }
