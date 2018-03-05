import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { AuthenticationService } from '../../core/auth/authentication.service';

import { Proyecto } from '../shared/proyecto.model';
import { ProyectoService } from '../shared/proyecto.service';

@Component({
  selector: 'app-proyecto',
  templateUrl: './proyecto.component.html',
  styleUrls: ['./proyecto.component.css']
})
export class ProyectoComponent implements OnInit, OnDestroy {
  @Input() proyecto: Proyecto;

  private intervalo_refresco: any;

  constructor(
    private proyectoService: ProyectoService,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      let id = +params['id'];
      this.proyectoService.getProyecto(id)
        .then(proyecto => {
          this.proyecto = proyecto;

          if(!proyecto.editable){
            this.router.navigate(['/proyectos']);
          }         

          this.proyectoService.updateFechaAperturaProyecto(proyecto.id);
          this.intervalo_refresco = setInterval(() => {
            this.proyectoService.updateFechaAperturaProyecto(proyecto.id);
          }, 180000);
        });
    });
  }

  ngOnDestroy() {
    if (this.intervalo_refresco) {
      clearInterval(this.intervalo_refresco);
    }
  }

}
