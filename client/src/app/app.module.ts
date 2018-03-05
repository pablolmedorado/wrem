import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// Rxjs
import './rxjs-extensions';

// ngx-boostrap
import { AlertModule } from 'ngx-bootstrap/alert';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

// App Root
import { AppComponent } from './app.component';

// App
import { CoreModule } from './core/core.module';
import { ProyectosModule } from './proyectos/proyectos.module';
import { DocumentosModule } from './documentos/documentos.module';
import { ObjetosModule } from './objetos/objetos.module';
import { GruposModule } from './grupos/grupos.module';

// Routing
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    // ngx-bootstrap
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    BsDropdownModule.forRoot(),
    TypeaheadModule.forRoot(),
    PaginationModule.forRoot(),
    PopoverModule.forRoot(),
    TooltipModule.forRoot(),
    // Core
    CoreModule.forRoot(),
    // App
    DocumentosModule,
    ProyectosModule,
    ObjetosModule,
    GruposModule,
    // Routing
    AppRoutingModule
  ],
  declarations: [
    AppComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
