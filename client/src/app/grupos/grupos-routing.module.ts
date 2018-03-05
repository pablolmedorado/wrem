import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../core/auth/auth-guard.service';

import { GrupoListComponent } from './grupo-list/grupo-list.component';

const gruposRouter: Routes = [
  {
    path: 'grupos',
    component: GrupoListComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(gruposRouter)
  ],
  exports: [
    RouterModule
  ]
})
export class GruposRoutingModule { }
