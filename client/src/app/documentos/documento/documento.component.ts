import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Map } from 'immutable';
import { TreeNode } from 'primeng/primeng';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Message } from 'primeng/primeng';

import { AuthenticationService } from '../../core/auth/authentication.service';

import { IProyecto } from '../../proyectos/shared/proyecto.model';
import { ProyectoService } from '../../proyectos/shared/proyecto.service';

import { IDocumento } from '../shared/documento.model';
import { DocumentoService } from '../shared/documento.service';

import { IObjeto } from '../../objetos/shared/models/objeto.model';
import { ObjetoService } from '../../objetos/shared/services/objeto.service';
import { ObjetoStreamService } from '../../objetos/shared/services/objeto-stream.service';
import { GrowlMessagesService } from '../../objetos/shared/services/growl-messages.service';

import * as TIPOS from '../../objetos/shared/tipos';

interface IFormModalInfo {tipo: string, subtipo?: string, id?: number, padre_id?: number, abuelo_id?: number, tipo_padre?: string};

@Component({
  selector: 'app-documento',
  templateUrl: './documento.component.html',
  styleUrls: ['./documento.component.css'],
  providers: [ObjetoStreamService, GrowlMessagesService]
})
export class DocumentoComponent implements OnInit, OnDestroy {
  @ViewChild('formModal') public formModal: ModalDirective;

  documento: IDocumento;
  objetos: Map<number, any>;

  private intervalo_refresco: any;

  private cargado: boolean = false;

  // modal formulario
  private objetoForm: any;
  private tipo_formulario: string;
  private subtipo_formulario: string;
  private objeto_form_id: number;
  private objeto_form_padre_id: number;
  private objeto_form_abuelo_id: number;
  private tipo_padre: string;
  private form_modal_title: string;

  private formModalInfo: IFormModalInfo;

  // Growl Messages
  growlMsgs: Message[] = [];

  constructor(
    private proyectoService: ProyectoService,
    private documentoService: DocumentoService,
    private objetoService: ObjetoService,
    private objetoStreamService: ObjetoStreamService,
    private growlMessagesService: GrowlMessagesService,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.objetoStreamService.objetosMap$.subscribe(map => {
      this.objetos = map;
    });
    this.growlMessagesService.growlMessages$.subscribe(msg => {
      this.appendGrowlMessage(msg);
    });

    this.route.params.subscribe(params => {
      let id = +params['id'];
      this.documentoService.getDocumento(id, {expand: 'proyecto,autor'})
        .then(documento => {
          this.documento = documento;
          let proyecto = <IProyecto>documento.proyecto;
          
          if(!documento.editable){
            this.router.navigate(['/proyectos']);
          }         

          this.proyectoService.updateFechaAperturaProyecto(proyecto.id);
          this.intervalo_refresco = setInterval(() => {
            this.proyectoService.updateFechaAperturaProyecto(proyecto.id);
          }, 180000);

          this.listObjetosFromProyecto(proyecto.id);
        });
      this.objetoService.listTiposTrazables()
        .then((tipos: Array<{id: number, model: string }>) => {
          let trazables_aux: TIPOS.IObjetoTrazable[] = [];
          tipos.forEach(tipo => {
            if(tipo.model === TIPOS.REQUISITO){
              Object.keys(TIPOS.CONFIG[TIPOS.REQUISITO].modal_title).forEach(title_key => {
                trazables_aux.push(Object.assign({}, tipo, { label: TIPOS.CONFIG[tipo.model].modal_title[title_key], type: title_key }));
              });
            }else{
              trazables_aux.push(Object.assign({}, tipo, { label: TIPOS.CONFIG[tipo.model].modal_title, type: null }));
            }
          });
          this.objetoStreamService.updateTiposTrazables(trazables_aux);
        });
      this.objetoService.listTiposBaseDefault()
        .then((tipos: TIPOS.ITipoBase[]) => this.objetoStreamService.updateTiposBase(tipos));
    });
  }

  ngOnDestroy() {
    if (this.intervalo_refresco) {
      clearInterval(this.intervalo_refresco);
    }
  }

  listObjetosFromProyecto(proyecto: number): void {
    this.objetoService.listObjetosFromProyecto(proyecto)
      .then(objetos_data => { 
        this.objetos = Map<number, any>();
        this.objetos = this.objetos.withMutations(map => {
          objetos_data.forEach(objeto => map.set(objeto.id, objeto));
        });
        this.objetoStreamService.updateMap(this.objetos);
        this.cargado = true;
      });
  }

  clearTipoModal(): void {
    this.formModalInfo = undefined;
    this.form_modal_title = undefined;
  }

  modalInit(event: IFormModalInfo): void{
    this.formModalInfo = event;
    this.form_modal_title = event.subtipo ? TIPOS.CONFIG[event.tipo].modal_title[event.subtipo] : TIPOS.CONFIG[event.tipo].modal_title;

    this.formModal.show();
  }

  formInit(formRef: ElementRef, form: any) {
    this.objetoForm = form;
  }

  hideFormModal(): void {
    this.formModal.hide();
  }

  appendGrowlMessage(message: Message): void {
    this.growlMsgs = []; // TODO: Mirar esto: https://github.com/primefaces/primeng/issues/2634
    this.growlMsgs.push(message);
  }

  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('print-section').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>${this.documento.nombre}</title>
        </head>
        <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );

    let popupWinHead = popupWin.document.head;
    let styles = document.head.getElementsByTagName('style');
    let bootstrap_media_print = "@media print{*,:after,:before{color:#000!important;text-shadow:none!important;background:0 0!important;box-shadow:none!important}";
    for(let i=0; i<styles.length; i++){
      let content = styles[i].innerText.replace(bootstrap_media_print,'');
      let style = popupWin.document.createElement('style');
      style.type = 'text/css';
      if (style.styleSheet){
        style.styleSheet.cssText = content;
      } else {
        style.appendChild(document.createTextNode(content));
      }
      popupWinHead.appendChild(style);
    }
    popupWin.document.close();
  }
}
