import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { ModalDirective } from 'ngx-bootstrap/modal';

import { IDocumento, Documento } from '../shared/documento.model';
import { DocumentoService } from '../shared/documento.service';

@Component({
  selector: 'app-documento-list',
  templateUrl: './documento-list.component.html',
  styleUrls: ['./documento-list.component.css']
})
export class DocumentoListComponent implements OnInit {
  @ViewChild('documentoModal') public documentoModal: ModalDirective;
  @Input() proyectoId: number;

  documentos: IDocumento[];
  selectedDocumento: IDocumento;
  documentoForm: any;

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
    private documentoService: DocumentoService
  ) { }

  ngOnInit() {
    this.current_page = 1;
    this.page_size = 10;
    this.ordering = '-id';
    this.listDocumentos();
  }

  listDocumentos(): void {
    let options = {
      fields: 'id,proyecto,nombre,creado',
      page: this.current_page,
      page_size: this.page_size,
      ordering: this.ordering
    };
    if(this.search) options['search'] = this.search;
    this.documentoService.listDocumentosIndexFromProyecto(this.proyectoId, options)
      .then(response => {
        this.documentos = response.results;
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
    this.listDocumentos();
  }

  filter(): void {
    if(this.search_query != this.search){
      this.search = this.search_query;
      this.listDocumentos();
    }
  }

  clearFilter(): void {
    this.search = undefined;
    this.search_query = undefined;
    this.listDocumentos();
  }

  documentoDetail(documento: IDocumento): void {
    this.router.navigate(['/documentos', documento.id]);
  }

  newDocumento(): void {
    this.selectedDocumento = new Documento({nombre: '', proyecto: this.proyectoId});
    this.documentoModal.show();
  }

  editDocumento(documento: IDocumento): void {
    this.selectedDocumento = documento;
    this.documentoModal.show();
  }

  clearSelectedDocumento(): void {
    this.selectedDocumento = null;
  }

  deleteDocumento(documento: IDocumento): void {
    if (confirm(`¿Está seguro que desea eliminar el documento ${documento.nombre}?`)) {
      this.documentoService.deleteDocumento(documento.id)
        .then(() => {
          this.current_page = 1;
          this.listDocumentos();
        });
    }
  }

  onDocumentosUpdate(documento: IDocumento) {
    this.current_page = 1;
    this.ordering = '-id';
    this.listDocumentos();
    this.documentoModal.hide();
  }

  pageChanged(event: any): void {
    this.current_page = event.page;
    this.page_size = event.itemsPerPage;
    this.listDocumentos();
  }

  setPageSize(size: string): void {
    this.current_page = 1;
    this.page_size = parseInt(size);
    this.listDocumentos();
  }

  formInit(formRef: ElementRef, form: any) {
    this.documentoForm = form;
  }

}
