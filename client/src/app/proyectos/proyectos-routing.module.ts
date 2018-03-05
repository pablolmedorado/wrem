import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../core/auth/auth-guard.service';

import { ProyectoListComponent } from './proyecto-list/proyecto-list.component';
import { ProyectoComponent } from './proyecto/proyecto.component';

const proyectosRoutes: Routes = [
  {
    path: 'proyectos',
    component: ProyectoListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'proyectos/:id',
    component: ProyectoComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(proyectosRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ProyectosRoutingModule { }
