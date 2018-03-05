import { Component, OnInit, ViewChild, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';

import { IProyecto, Proyecto } from '../shared/proyecto.model';
import { ProyectoService } from '../shared/proyecto.service';

import { IGrupo, Grupo } from '../../grupos/shared/grupo.model';
import { GrupoService } from '../../grupos/shared/grupo.service';

@Component({
  selector: 'app-proyecto-form',
  templateUrl: './proyecto-form.component.html',
  styleUrls: ['./proyecto-form.component.css'],
  exportAs: 'ProyectoForm'
})
export class ProyectoFormComponent implements OnInit {
  @Input() proyecto: IProyecto;
  @Output() onSuccess = new EventEmitter<IProyecto>();

  formGroup: FormGroup;
  private submitted: boolean = false;
  @ViewChild('ProyectoForm') form;

  // Multiselect config
  private gruposOptions: IMultiSelectOption[] = [];
  private readonly multiselectSettings: IMultiSelectSettings = {
    showCheckAll: true,
    showUncheckAll: true,
    displayAllSelectedText: true,
    dynamicTitleMaxItems: 0,
    enableSearch: true,
    buttonClasses: 'btn btn-default btn-block',
    containerClasses: ''
  };
  private readonly multiselectGruposTexts: IMultiSelectTexts = {
    checkAll: 'Seleccionar todos',
    uncheckAll: 'Limpiar seleccionados',
    checked: 'grupo seleccionado',
    checkedPlural: 'grupos seleccionados',
    searchPlaceholder: 'Buscar...',
    defaultTitle: 'Ninguno',
    allSelected: 'Todos'
  };

  constructor(
    private proyectoService: ProyectoService, 
    private grupoService: GrupoService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.formGroup = this.fb.group({
      id: null,
      nombre: ['', Validators.required],
      grupos: [[]]
    });

    if(this.proyecto.id){
      this.proyectoService.getProyecto(this.proyecto.id)
        .then(proyecto => {
          this.formGroup.controls['id'].setValue(proyecto.id);
          this.formGroup.controls['nombre'].setValue(proyecto.nombre);
          this.formGroup.controls['grupos'].setValue(proyecto.grupos);
        });
    }

    this.listGrupos();
  }

  listGrupos(): void {
    this.grupoService.listGrupos({fields: 'id,nombre'})
      .then(response => {
        this.gruposOptions = response.map(grupo => {return {id: grupo.id, name: grupo.nombre} as IMultiSelectOption});
      });
  }

  onSubmit({ value, valid, dirty }: { value: IProyecto, valid: boolean, dirty: boolean }): void {
    this.submitted = true;
    if(valid){
      let method = value.id ? 'partialUpdateProyecto' : 'createProyecto';
      this.proyectoService[method](value)
        .then(proyecto => {
          this.onSuccess.emit(proyecto);
        });
    }
  }

}
