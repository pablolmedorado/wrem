import { Component, OnInit, EventEmitter, ViewChild, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { IDocumento, Documento } from '../shared/documento.model';
import { DocumentoService } from '../shared/documento.service';

import { IObjeto } from '../../objetos/shared/models/objeto.model';
import { ObjetoService } from '../../objetos/shared/services/objeto.service';

import * as TIPOS from '../../objetos/shared/tipos';

@Component({
  selector: 'app-documento-form',
  templateUrl: './documento-form.component.html',
  styleUrls: ['./documento-form.component.css'],
  exportAs: 'DocumentoForm'
})
export class DocumentoFormComponent implements OnInit {
  @Input() proyectoId: number;
  @Input() documento: IDocumento;
  @Output() onSuccess = new EventEmitter<IDocumento>();

  formGroup: FormGroup;
  private submitted: boolean = false;
  @ViewChild('DocumentoForm') form;

  private organizaciones: IObjeto[];

  private readonly nombres_predefinidos: string[] = [
    'Documento de Requisitos del Sistema',
    'Documento de Análisis del Sistema',
    'Registro de conflictos y defectos',
    'Registro de peticiones de cambio'
  ];

  constructor(
    private objetoService: ObjetoService,
    private documentoService: DocumentoService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.formGroup = this.fb.group({
      id: null,
      proyecto: [this.proyectoId, Validators.required],
      nombre: ['', Validators.required],
      version: ['1.0', [Validators.required, Validators.pattern('\\d+.\\d+(.\\d+)?')]],
      organizacion_por: null,
      organizacion_para: null
    });

    if(this.documento.id){
      this.documentoService.getDocumento(this.documento.id)
        .then(documento => {
          this.formGroup.controls['id'].setValue(documento.id);
          this.formGroup.controls['nombre'].setValue(documento.nombre);
          this.formGroup.controls['version'].setValue(documento.version);
          this.formGroup.controls['organizacion_por'].setValue(documento.organizacion_por);
          this.formGroup.controls['organizacion_para'].setValue(documento.organizacion_para);
        });
    }

    this.listOrganizaciones();
  }

  listOrganizaciones(): void {
    this.objetoService.listObjetosIndexFromProyecto(this.proyectoId, TIPOS.CONFIG[TIPOS.ORGANIZACION].api_reference)
      .then(organizaciones => { this.organizaciones = organizaciones; });
  }

  onSubmit({ value, valid, dirty }: { value: IDocumento, valid: boolean, dirty: boolean }): void {
    this.submitted = true;
    if(valid){
      let method = value.id ? 'partialUpdateDocumento' : 'createDocumento';
      this.documentoService[method](value)
        .then(documento => {
          this.onSuccess.emit(documento);
        });
    }
  }

}
