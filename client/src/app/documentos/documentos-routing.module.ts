import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../core/auth/auth-guard.service';

import { DocumentoComponent } from './documento/documento.component';

const documentosRouter: Routes = [
  {
    path: 'documentos/:id',
    component: DocumentoComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(documentosRouter)
  ],
  exports: [
    RouterModule
  ]
})
export class DocumentosRoutingModule { }
