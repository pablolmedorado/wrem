import { Component, OnInit, Input,Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import * as TIPOS from '../shared/tipos';

@Component({
  selector: 'app-objeto-menu-bar',
  templateUrl: './objeto-menu-bar.component.html',
  styleUrls: ['./objeto-menu-bar.component.css']
})
export class ObjetoMenuBarComponent implements OnInit {
  @Input() proyectoId: number;
  @Output() onCreateObjeto = new EventEmitter<{tipo: string, subtipo?: string}>();
  @Output() onPrint = new EventEmitter();

  objetos: any[];
  menu: any[];

  constructor(private router: Router) { }

  ngOnInit() {
    this.menu = [
      {
        title: 'Salir',
        icon: 'fa-arrow-left',
        command: (event) => { this.router.navigate(['/proyectos', this.proyectoId]); } },
      {
        title: 'Imprimir',
        icon: 'fa-print',
        command: (event) => { this.onPrint.emit() }
      }
    ]
    this.objetos = [
      {
        acronym: TIPOS.CONFIG[TIPOS.SECCION].prefix,
        title: TIPOS.CONFIG[TIPOS.SECCION].modal_title,
        icon: TIPOS.CONFIG[TIPOS.SECCION].icon,
        command: (event) => { this.onCreateObjeto.emit({tipo:TIPOS.SECCION}) }
      },
      {
        acronym: TIPOS.CONFIG[TIPOS.PARRAFO].prefix,
        title: TIPOS.CONFIG[TIPOS.PARRAFO].modal_title,
        icon: TIPOS.CONFIG[TIPOS.PARRAFO].icon,
        command: (event) => { this.onCreateObjeto.emit({tipo:TIPOS.PARRAFO}) }
      },
      {
        acronym: TIPOS.CONFIG[TIPOS.IMAGEN].prefix,
        title: TIPOS.CONFIG[TIPOS.IMAGEN].modal_title,
        icon: TIPOS.CONFIG[TIPOS.IMAGEN].icon,
        command: (event) => { this.onCreateObjeto.emit({tipo:TIPOS.IMAGEN}) }
      },
      {
        acronym: TIPOS.CONFIG[TIPOS.ORGANIZACION].prefix,
        title: TIPOS.CONFIG[TIPOS.ORGANIZACION].modal_title,
        icon: TIPOS.CONFIG[TIPOS.ORGANIZACION].icon,
        command: (event) => { this.onCreateObjeto.emit({tipo:TIPOS.ORGANIZACION}) }
      },
      {
        acronym: TIPOS.CONFIG[TIPOS.PARTICIPANTE].prefix,
        title: TIPOS.CONFIG[TIPOS.PARTICIPANTE].modal_title,
        icon: TIPOS.CONFIG[TIPOS.PARTICIPANTE].icon,
        command: (event) => { this.onCreateObjeto.emit({tipo:TIPOS.PARTICIPANTE}) }
      },
      {
        acronym: TIPOS.CONFIG[TIPOS.REUNION].prefix,
        title: TIPOS.CONFIG[TIPOS.REUNION].modal_title,
        icon: TIPOS.CONFIG[TIPOS.REUNION].icon,
        command: (event) => { this.onCreateObjeto.emit({tipo:TIPOS.REUNION}) }
      },
      {
        acronym: TIPOS.CONFIG[TIPOS.OBJETIVO].prefix,
        title: TIPOS.CONFIG[TIPOS.OBJETIVO].modal_title,
        icon: TIPOS.CONFIG[TIPOS.OBJETIVO].icon,
        command: (event) => { this.onCreateObjeto.emit({tipo:TIPOS.OBJETIVO}) }
      },
      {
        acronym: TIPOS.CONFIG[TIPOS.ACTOR].prefix,
        title: TIPOS.CONFIG[TIPOS.ACTOR].modal_title,
        icon: TIPOS.CONFIG[TIPOS.ACTOR].icon,
        command: (event) => { this.onCreateObjeto.emit({tipo:TIPOS.ACTOR}) }
      },
      {
        acronym: TIPOS.CONFIG[TIPOS.REQUISITO_INFORMACION].prefix,
        title: TIPOS.CONFIG[TIPOS.REQUISITO_INFORMACION].modal_title,
        icon: TIPOS.CONFIG[TIPOS.REQUISITO_INFORMACION].icon,
        command: (event) => { this.onCreateObjeto.emit({tipo:'requisitoinformacionrem'}) }
      },
      {
        acronym: TIPOS.CONFIG[TIPOS.REQUISITO].prefix['R'],
        title: TIPOS.CONFIG[TIPOS.REQUISITO].modal_title['R'],
        icon: TIPOS.CONFIG[TIPOS.REQUISITO].icon['R'],
        command: (event) => { this.onCreateObjeto.emit({tipo:TIPOS.REQUISITO, subtipo: 'R'}) }
      },
      {
        acronym: TIPOS.CONFIG[TIPOS.CASO_USO].prefix,
        title: TIPOS.CONFIG[TIPOS.CASO_USO].modal_title,
        icon: TIPOS.CONFIG[TIPOS.CASO_USO].icon,
        command: (event) => { this.onCreateObjeto.emit({tipo:TIPOS.CASO_USO}) }
      },
      {
        acronym: TIPOS.CONFIG[TIPOS.REQUISITO].prefix['F'],
        title: TIPOS.CONFIG[TIPOS.REQUISITO].modal_title['F'],
        icon: TIPOS.CONFIG[TIPOS.REQUISITO].icon['F'], 
        command: (event) => { this.onCreateObjeto.emit({tipo:TIPOS.REQUISITO, subtipo: 'F'}) }
      },
      {
        acronym: TIPOS.CONFIG[TIPOS.REQUISITO].prefix['NF'],
        title: TIPOS.CONFIG[TIPOS.REQUISITO].modal_title['NF'],
        icon: TIPOS.CONFIG[TIPOS.REQUISITO].icon['NF'],
        command: (event) => { this.onCreateObjeto.emit({tipo:TIPOS.REQUISITO, subtipo: 'NF'}) }
      },
      {
        acronym: TIPOS.CONFIG[TIPOS.MATRIZ_TRAZABILIDAD].prefix,
        title: TIPOS.CONFIG[TIPOS.MATRIZ_TRAZABILIDAD].modal_title,
        icon: TIPOS.CONFIG[TIPOS.MATRIZ_TRAZABILIDAD].icon,
        command: (event) => { this.onCreateObjeto.emit({tipo:TIPOS.MATRIZ_TRAZABILIDAD}) }
      },
      {
        acronym: TIPOS.CONFIG[TIPOS.TIPO_OBJETOS].prefix,
        title: TIPOS.CONFIG[TIPOS.TIPO_OBJETOS].modal_title,
        icon: TIPOS.CONFIG[TIPOS.TIPO_OBJETOS].icon,
        command: (event) => { this.onCreateObjeto.emit({tipo:TIPOS.TIPO_OBJETOS}) }
      },
      {
        acronym: TIPOS.CONFIG[TIPOS.TIPO_VALOR].prefix,
        title: TIPOS.CONFIG[TIPOS.TIPO_VALOR].modal_title,
        icon: TIPOS.CONFIG[TIPOS.TIPO_VALOR].icon,
        command: (event) => { this.onCreateObjeto.emit({tipo:TIPOS.TIPO_VALOR}) }
      },
      {
        acronym: TIPOS.CONFIG[TIPOS.ASOCIACION].prefix,
        title: TIPOS.CONFIG[TIPOS.ASOCIACION].modal_title,
        icon: TIPOS.CONFIG[TIPOS.ASOCIACION].icon,
        command: (event) => { this.onCreateObjeto.emit({tipo:TIPOS.ASOCIACION}) }
      },
      {
        acronym: TIPOS.CONFIG[TIPOS.OPERACION_SISTEMA].prefix,
        title: TIPOS.CONFIG[TIPOS.OPERACION_SISTEMA].modal_title,
        icon: TIPOS.CONFIG[TIPOS.OPERACION_SISTEMA].icon,
        command: (event) => { this.onCreateObjeto.emit({tipo:TIPOS.OPERACION_SISTEMA}) }
      },
      {
        acronym: TIPOS.CONFIG[TIPOS.CONFLICTO].prefix,
        title: TIPOS.CONFIG[TIPOS.CONFLICTO].modal_title,
        icon: TIPOS.CONFIG[TIPOS.CONFLICTO].icon,
        command: (event) => { this.onCreateObjeto.emit({tipo:TIPOS.CONFLICTO}) }
      },
      {
        acronym: TIPOS.CONFIG[TIPOS.DEFECTO].prefix,
        title: TIPOS.CONFIG[TIPOS.DEFECTO].modal_title,
        icon: TIPOS.CONFIG[TIPOS.DEFECTO].icon,
        command: (event) => { this.onCreateObjeto.emit({tipo:TIPOS.DEFECTO}) }
      },
      {
        acronym: TIPOS.CONFIG[TIPOS.PETICION_CAMBIO].prefix,
        title: TIPOS.CONFIG[TIPOS.PETICION_CAMBIO].modal_title,
        icon: TIPOS.CONFIG[TIPOS.PETICION_CAMBIO].icon,
        command: (event) => { this.onCreateObjeto.emit({tipo:TIPOS.PETICION_CAMBIO}) }
      }
    ];
  }

}
