import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

import { ModalDirective } from 'ngx-bootstrap/modal';

import { AuthenticationService } from '../../core/auth/authentication.service';

import { IGrupo, Grupo } from '../shared/grupo.model';
import { GrupoService } from '../shared/grupo.service';

@Component({
  selector: 'app-grupo-list',
  templateUrl: './grupo-list.component.html',
  styleUrls: ['./grupo-list.component.css']
})
export class GrupoListComponent implements OnInit {
  @ViewChild('grupoModal') public grupoModal: ModalDirective;

  grupos: IGrupo[];
  selectedGrupo: IGrupo;
  grupoForm: any;

  private current_page: number;
  item_count: number;
  private page_size: number;
  private max_pager_size: number = 5;
  private number_of_pages: number;

  ordering: string;

  search_query: string;
  search: string;

  constructor(
    public auth: AuthenticationService,
    private grupoService: GrupoService
  ) { }

  ngOnInit() {
    this.current_page = 1;
    this.page_size = 10;
    this.ordering = '-id';
    this.listGrupos();
  }

  listGrupos(): void {
    let options = {page: this.current_page, page_size: this.page_size, ordering: this.ordering};
    if(this.search) options['search'] = this.search;
    this.grupoService.listGruposIndex(options)
      .then(response => {
        this.grupos = response.results;
        this.item_count = response.count;
      });
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
    this.listGrupos();
  }

  filter(): void {
    if(this.search_query != this.search){
      this.search = this.search_query;
      this.listGrupos();
    }
  }

  clearFilter(): void {
    this.search = undefined;
    this.search_query = undefined;
    this.listGrupos();
  }

  newGrupo(): void {
    this.selectedGrupo = new Grupo({nombre: ''});
    this.grupoModal.show();
  }

  editGrupo(grupo: IGrupo): void {
    this.selectedGrupo = grupo;
    this.grupoModal.show();
  }

  clearSelectedGrupo(): void {
    this.selectedGrupo = null;
  }

  deleteGrupo(grupo: IGrupo): void {
    if (confirm(`¿Está seguro que desea eliminar el grupo ${grupo.nombre}?`)) {
      this.grupoService.deleteGrupo(grupo.id)
        .then(() => {
          this.current_page = 1;
          this.listGrupos();
        });
    }
  }

  onGruposUpdate(grupo: IGrupo) {
    this.current_page = 1;
    this.ordering = '-id';
    this.listGrupos();
    this.grupoModal.hide();
  }

  pageChanged(event: any): void {
    this.current_page = event.page;
    this.page_size = event.itemsPerPage;
    this.listGrupos();
  }

  setPageSize(size: string): void {
    this.current_page = 1;
    this.page_size = parseInt(size);
    this.listGrupos();
  }

  formInit(formRef: ElementRef, form: any) {
    this.grupoForm = form;
  }

}
