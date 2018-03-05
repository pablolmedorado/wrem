import { Component, OnInit, EventEmitter, ViewChild, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';

import { AuthenticationService } from '../../core/auth/authentication.service';

import { IGrupo, Grupo } from '../shared/grupo.model';
import { GrupoService } from '../shared/grupo.service';

@Component({
  selector: 'app-grupo-form',
  templateUrl: './grupo-form.component.html',
  styleUrls: ['./grupo-form.component.css'],
  exportAs: 'GrupoForm'
})
export class GrupoFormComponent implements OnInit {
  @Input() grupo: IGrupo;
  @Output() onSuccess = new EventEmitter<IGrupo>();

  formGroup: FormGroup;
  private submitted: boolean = false;
  @ViewChild('GrupoForm') form;

  private proyectosOptions: any; 
  administrador: string;

  // Multiselect config
  private usuariosOptions: IMultiSelectOption[] = [];
  private readonly multiselectSettings: IMultiSelectSettings = {
    showCheckAll: true,
    showUncheckAll: true,
    displayAllSelectedText: true,
    dynamicTitleMaxItems: 0,
    enableSearch: true,
    buttonClasses: 'btn btn-default btn-block',
    containerClasses: ''
  };
  private readonly multiselectUsuariosTexts: IMultiSelectTexts = {
    checkAll: 'Seleccionar todos',
    uncheckAll: 'Limpiar seleccionados',
    checked: 'usuario seleccionado',
    checkedPlural: 'usuarios seleccionados',
    searchPlaceholder: 'Buscar...',
    defaultTitle: 'Ninguno',
    allSelected: 'Todos'
  };

  constructor(
    private auth: AuthenticationService, private grupoService: GrupoService, private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.formGroup = this.fb.group({
      id: null,
      nombre: ['', Validators.required],
      administrador: [null, Validators.required],
      usuarios: [[], Validators.required]
    });

    if(this.grupo.id){
      this.grupoService.getGrupo(this.grupo.id, {expand:'proyectos,administrador'})
        .then((grupo: any) => {
          this.formGroup.controls['id'].setValue(grupo.id);
          this.formGroup.controls['nombre'].setValue(grupo.nombre);
          this.formGroup.controls['usuarios'].setValue(grupo.usuarios);
          this.formGroup.controls['administrador'].setValue(grupo.administrador);
          this.proyectosOptions = grupo.proyectos;
          this.administrador = grupo.administrador.full_name;
        });
    }else{
      this.formGroup.controls['usuarios'].setValue(this.grupo.usuarios.concat([this.auth.usuario.id]));
      this.formGroup.controls['administrador'].setValue(this.auth.usuario.id);
    }

    this.listUsuarios();
  }

  listUsuarios(): void {
    this.grupoService.listUsuariosSelect()
      .then(usuarios => {
        this.usuariosOptions = usuarios.map(usuario => {return {id: usuario.id, name: usuario.full_name} as IMultiSelectOption});
      });
  }

  onSubmit({ value, valid, dirty }: { value: IGrupo, valid: boolean, dirty: boolean }): void {
    this.submitted = true;
    if(valid){
      let method = value.id ? 'partialUpdateGrupo' : 'createGrupo';
      this.grupoService[method](value)
        .then(grupo => {
          this.onSuccess.emit(grupo);
        });
    }
  }

}
