import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

// Ngx Bootstrap
import { AlertModule } from 'ngx-bootstrap/alert';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';

import { TreeModule, MenubarModule, ContextMenuModule, GrowlModule } from 'primeng/primeng';

import { ObjetoService } from './shared/services/objeto.service';

import { ObjetoTreeComponent } from './objeto-tree/objeto-tree.component';
import { ObjetoMenuBarComponent } from './objeto-menu-bar/objeto-menu-bar.component';

import { ObjetoListHtmlComponent } from './objeto-list-html/objeto-list-html.component';

import { ParrafoRepresentationComponent } from './objeto-html-representations/parrafo-representation/parrafo-representation.component';
import { OrganizacionRepresentationComponent } from './objeto-html-representations/organizacion-representation/organizacion-representation.component';
import { ParticipanteRepresentationComponent } from './objeto-html-representations/participante-representation/participante-representation.component';
import { ReunionRepresentationComponent } from './objeto-html-representations/reunion-representation/reunion-representation.component';
import { ActorRepresentationComponent } from './objeto-html-representations/actor-representation/actor-representation.component';
import { ReqInfRepresentationComponent } from './objeto-html-representations/req-inf-representation/req-inf-representation.component';
import { RequisitoRepresentationComponent } from './objeto-html-representations/requisito-representation/requisito-representation.component';
import { CasoUsoRepresentationComponent } from './objeto-html-representations/caso-uso-representation/caso-uso-representation.component';
import { TipoObjetoRepresentationComponent } from './objeto-html-representations/tipo-objeto-representation/tipo-objeto-representation.component';
import { TipoValorRepresentationComponent } from './objeto-html-representations/tipo-valor-representation/tipo-valor-representation.component';
import { AsociacionRepresentationComponent } from './objeto-html-representations/asociacion-representation/asociacion-representation.component';
import { OperacionSistemaRepresentationComponent } from './objeto-html-representations/operacion-sistema-representation/operacion-sistema-representation.component';
import { ConflictoRepresentationComponent } from './objeto-html-representations/conflicto-representation/conflicto-representation.component';
import { DefectoRepresentationComponent } from './objeto-html-representations/defecto-representation/defecto-representation.component';
import { PeticionCambioRepresentationComponent } from './objeto-html-representations/peticion-cambio-representation/peticion-cambio-representation.component';
import { ObjetivoRepresentationComponent } from './objeto-html-representations/objetivo-representation/objetivo-representation.component';
import { SeccionRepresentationComponent } from './objeto-html-representations/seccion-representation/seccion-representation.component';

import { ParrafoFormComponent } from './forms/parrafo-form/parrafo-form.component';
import { SeccionFormComponent } from './forms/seccion-form/seccion-form.component';
import { GeneralTabComponent } from './forms/form-tabs/general-tab/general-tab.component';
import { LogTabComponent } from './forms/form-tabs/log-tab/log-tab.component';
import { CommentTabComponent } from './forms/form-tabs/comment-tab/comment-tab.component';
import { OrganizationTabComponent } from './forms/form-tabs/organization-tab/organization-tab.component';
import { TrackingTabComponent } from './forms/form-tabs/tracking-tab/tracking-tab.component';
import { OrganizacionFormComponent } from './forms/organizacion-form/organizacion-form.component';
import { ParticipanteFormComponent } from './forms/participante-form/participante-form.component';
import { ReunionFormComponent } from './forms/reunion-form/reunion-form.component';
import { ObjetivoFormComponent } from './forms/objetivo-form/objetivo-form.component';
import { ActorFormComponent } from './forms/actor-form/actor-form.component';
import { RequisitoInformacionFormComponent } from './forms/requisito-informacion-form/requisito-informacion-form.component';
import { DatoEspecificoFormComponent } from './forms/dato-especifico-form/dato-especifico-form.component';
import { RequisitoFormComponent } from './forms/requisito-form/requisito-form.component';
import { CasoUsoFormComponent } from './forms/caso-uso-form/caso-uso-form.component';
import { PasoCuFormComponent } from './forms/paso-cu-form/paso-cu-form.component';
import { ExcepcionPasoCuFormComponent } from './forms/excepcion-paso-cu-form/excepcion-paso-cu-form.component';
import { TipoObjetoFormComponent } from './forms/tipo-objeto-form/tipo-objeto-form.component';
import { ComponenteFormComponent } from './forms/componente-form/componente-form.component';
import { AtributoFormComponent } from './forms/atributo-form/atributo-form.component';
import { ExpresionFormComponent } from './forms/expresion-form/expresion-form.component';
import { TipoValorFormComponent } from './forms/tipo-valor-form/tipo-valor-form.component';
import { AsociacionFormComponent } from './forms/asociacion-form/asociacion-form.component';
import { RolFormComponent } from './forms/rol-form/rol-form.component';
import { OperacionSistemaFormComponent } from './forms/operacion-sistema-form/operacion-sistema-form.component';
import { ParametroFormComponent } from './forms/parametro-form/parametro-form.component';
import { ExcepcionOsFormComponent } from './forms/excepcion-os-form/excepcion-os-form.component';
import { ConflictoFormComponent } from './forms/conflicto-form/conflicto-form.component';
import { AlternativaFormComponent } from './forms/alternativa-form/alternativa-form.component';
import { DefectoFormComponent } from './forms/defecto-form/defecto-form.component';
import { PeticionCambioFormComponent } from './forms/peticion-cambio-form/peticion-cambio-form.component';
import { ImagenFormComponent } from './forms/imagen-form/imagen-form.component';
import { MatrizTrazabilidadFormComponent } from './forms/matriz-trazabilidad-form/matriz-trazabilidad-form.component';
import { MatrizTrazabilidadRepresentationComponent } from './objeto-html-representations/matriz-trazabilidad-representation/matriz-trazabilidad-representation.component';
import { ImagenRepresentationComponent } from './objeto-html-representations/imagen-representation/imagen-representation.component';

@NgModule({
  imports: [
    SharedModule,

    AlertModule,
    TabsModule,
    ModalModule,
    TooltipModule,

    TreeModule,
    MenubarModule,
    ContextMenuModule,
    GrowlModule,

    NgxMyDatePickerModule,
    MultiselectDropdownModule
  ],
  declarations: [
    ObjetoTreeComponent,
    ObjetoMenuBarComponent,
    ObjetoListHtmlComponent,
    ParrafoRepresentationComponent,
    OrganizacionRepresentationComponent,
    ParticipanteRepresentationComponent,
    ReunionRepresentationComponent,
    ActorRepresentationComponent,
    ReqInfRepresentationComponent,
    RequisitoRepresentationComponent,
    CasoUsoRepresentationComponent,
    TipoObjetoRepresentationComponent,
    TipoValorRepresentationComponent,
    AsociacionRepresentationComponent,
    OperacionSistemaRepresentationComponent,
    ConflictoRepresentationComponent,
    DefectoRepresentationComponent,
    PeticionCambioRepresentationComponent,
    ObjetivoRepresentationComponent,
    SeccionRepresentationComponent,
    ParrafoFormComponent,
    SeccionFormComponent,
    GeneralTabComponent,
    LogTabComponent,
    CommentTabComponent,
    OrganizationTabComponent,
    TrackingTabComponent,
    OrganizacionFormComponent,
    ParticipanteFormComponent,
    ReunionFormComponent,
    ObjetivoFormComponent,
    ActorFormComponent,
    RequisitoInformacionFormComponent,
    DatoEspecificoFormComponent,
    RequisitoFormComponent,
    CasoUsoFormComponent,
    PasoCuFormComponent,
    ExcepcionPasoCuFormComponent,
    TipoObjetoFormComponent,
    ComponenteFormComponent,
    AtributoFormComponent,
    ExpresionFormComponent,
    TipoValorFormComponent,
    AsociacionFormComponent,
    RolFormComponent,
    OperacionSistemaFormComponent,
    ParametroFormComponent,
    ExcepcionOsFormComponent,
    ConflictoFormComponent,
    AlternativaFormComponent,
    DefectoFormComponent,
    PeticionCambioFormComponent,
    ImagenFormComponent,
    MatrizTrazabilidadFormComponent,
    MatrizTrazabilidadRepresentationComponent,
    ImagenRepresentationComponent
  ],
  exports: [
    ObjetoTreeComponent,
    ObjetoMenuBarComponent,
    ObjetoListHtmlComponent,
    ParrafoRepresentationComponent, 
    OrganizacionRepresentationComponent,
    ParticipanteRepresentationComponent,
    ReunionRepresentationComponent,
    ActorRepresentationComponent,
    ReqInfRepresentationComponent,
    RequisitoRepresentationComponent,
    CasoUsoRepresentationComponent,
    TipoObjetoRepresentationComponent,
    TipoValorRepresentationComponent,
    OperacionSistemaRepresentationComponent,
    ConflictoRepresentationComponent,
    DefectoRepresentationComponent,
    PeticionCambioRepresentationComponent,
    ObjetivoRepresentationComponent,
    SeccionRepresentationComponent,
    ParrafoFormComponent,
    SeccionFormComponent,
    GeneralTabComponent,
    LogTabComponent,
    CommentTabComponent,
    OrganizationTabComponent,
    TrackingTabComponent,
    OrganizacionFormComponent,
    ParticipanteFormComponent,
    ReunionFormComponent,
    ObjetivoFormComponent,
    ActorFormComponent,
    RequisitoInformacionFormComponent,
    DatoEspecificoFormComponent,
    RequisitoFormComponent,
    CasoUsoFormComponent,
    PasoCuFormComponent,
    ExcepcionPasoCuFormComponent,
    TipoObjetoFormComponent,
    ComponenteFormComponent,
    AtributoFormComponent,
    ExpresionFormComponent,
    TipoValorFormComponent,
    AsociacionFormComponent,
    RolFormComponent,
    OperacionSistemaFormComponent,
    ParametroFormComponent,
    ExcepcionOsFormComponent,
    ConflictoFormComponent,
    AlternativaFormComponent,
    DefectoFormComponent,
    PeticionCambioFormComponent,
    ImagenFormComponent,
    MatrizTrazabilidadFormComponent,
    MatrizTrazabilidadRepresentationComponent,
    ImagenRepresentationComponent
  ],
  providers: [ObjetoService]
})
export class ObjetosModule { }
