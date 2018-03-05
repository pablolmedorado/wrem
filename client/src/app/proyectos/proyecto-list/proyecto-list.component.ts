import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import * as _ from 'lodash';

import { ModalDirective } from 'ngx-bootstrap/modal';

import { AuthenticationService } from '../../core/auth/authentication.service';

import { IProyecto, Proyecto } from '../shared/proyecto.model';
import { ProyectoService } from '../shared/proyecto.service';

import { IGrupo, Grupo } from '../../grupos/shared/grupo.model';
import { GrupoService } from '../../grupos/shared/grupo.service';

@Component({
  selector: 'app-proyecto-list',
  templateUrl: './proyecto-list.component.html',
  styleUrls: ['./proyecto-list.component.css']
})
export class ProyectoListComponent implements OnInit {
  @ViewChild('proyectoModal') public proyectoModal: ModalDirective;

  proyectos: any[];
  selectedProyecto: IProyecto;
  proyectoForm: any;

  private grupos: any = {};

  private current_page: number;
  item_count: number;
  private page_size: number;
  private max_pager_size: number = 5;
  private number_of_pages: number;

  ordering: string;

  search_query: string;
  search: string;

  constructor(
    private router: Router,
    private auth: AuthenticationService, 
    private proyectoService: ProyectoService,
    private grupoService: GrupoService,
  ) { }

  ngOnInit() {
    this.current_page = 1;
    this.page_size = 10;
    this.ordering = '-id';
    this.listProyectos();
    this.listGrupos();
  }

  listProyectos(): void {
    let options = {
      fields: 'id,nombre,autor,creado,fecha_ultima_apertura,usuario_ultima_apertura,grupos,editable',
      page: this.current_page,
      page_size: this.page_size,
      ordering: this.ordering
    };
    if(this.search) options['search'] = this.search;
    this.proyectoService.listProyectosIndex(options).then(response => {
      this.proyectos = response.results;
      this.item_count = response.count;
    });
  }

  listGrupos(): void {
    this.grupoService.listGrupos({fields: 'id,nombre'}).then(response => this.grupos = _.keyBy(response, 'id'));
  }

  order(param: string): void {
    let current_order_is_desc = this.ordering.startsWith('-');
    let current_param_name = current_order_is_desc ? this.ordering.substring(1) : this.ordering;

    if(param === current_param_name){
      this.ordering = current_order_is_desc ? param : '-'+param;
    } else {
      this.ordering = param;
    }
    this.current_page = 1;
    this.listProyectos();
  }

  filter(): void {
    if(this.search_query != this.search){
      this.search = this.search_query;
      this.listProyectos();
    }
  }

  clearFilter(): void {
    this.search = undefined;
    this.search_query = undefined;
    this.listProyectos();
  }

  proyectoDetail(proyecto: IProyecto): void {
    this.router.navigate(['/proyectos', proyecto.id]);
  }

  newProyecto(): void {
    this.selectedProyecto = new Proyecto({nombre: ''});
    this.proyectoModal.show();
  }

  editProyecto(proyecto: IProyecto): void {
    this.selectedProyecto = proyecto;
    this.proyectoModal.show();
  }

  clearSelectedProyecto(): void {
    this.selectedProyecto = null;
  }

  deleteProyecto(proyecto: IProyecto): void {
    if (confirm(`¿Está seguro que desea eliminar el proyecto ${proyecto.nombre}? Esto eliminará además todos los elementos que lo componen.`)) {
      this.proyectoService.deleteProyecto(proyecto.id)
        .then(() => {
          this.current_page = 1;
          this.listProyectos();
        });
    }
  }

  onProyectosUpdate(proyecto: IProyecto) {
    this.current_page = 1;
    this.ordering = '-id';
    this.listProyectos();
    this.proyectoModal.hide();
  }

  pageChanged(event: any): void {
    this.current_page = event.page;
    this.page_size = event.itemsPerPage;
    this.listProyectos();
  }

  setPageSize(size: string): void {
    this.current_page = 1;
    this.page_size = parseInt(size);
    this.listProyectos();
  }

  formInit(formRef: ElementRef, form: any) {
    this.proyectoForm = form;
  }

}
