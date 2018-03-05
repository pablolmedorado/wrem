import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { TreeNode, MenuItem } from 'primeng/primeng';
import { Map } from 'immutable';

import { IDocumento } from '../../documentos/shared/documento.model';
import { IObjeto } from '../shared/models/objeto.model';
import { ObjetoService } from '../shared/services/objeto.service';
import { ObjetoStreamService } from '../shared/services/objeto-stream.service';
import { GrowlMessagesService } from '../shared/services/growl-messages.service';

import * as TIPOS from '../shared/tipos';
import { objetoComparator } from '../shared/utils';

interface IEventTreeNode extends TreeNode { id?: string|number, objeto_padre_id?: number, objeto_abuelo_id?: number };
interface IFormModalInfo {tipo: string, subtipo?: string, id?: number, padre_id?: number, abuelo_id?: number, tipo_padre?: string};

@Component({
  selector: 'app-objeto-tree',
  templateUrl: './objeto-tree.component.html',
  styleUrls: ['./objeto-tree.component.css']
})
export class ObjetoTreeComponent implements OnInit, OnDestroy {
  @Input() documento: IDocumento;

  @Output() onEditDocumento = new EventEmitter();
  @Output() onEdit = new EventEmitter<IFormModalInfo>();

  objetos: Map<number, any>;
  private objetosSubscription: Subscription;

  // Tree component
  nodes: TreeNode[];
  selectedNode: TreeNode;
  private expanded_nodes: any[] = [];
  
  // Context Menu
  private contextMenu: MenuItem[];

  constructor(
    private objetoService: ObjetoService, 
    private objetoStreamService: ObjetoStreamService,
    private growlMessagesService: GrowlMessagesService
  ) {
  }

  ngOnInit() {
    this.nodes = [
      { label: this.documento.nombre, type: 'root', icon: 'fa-file-text', expanded: true,  selectable: false, children: [] }
    ];

    this.objetosSubscription = this.objetoStreamService.objetosMap$.subscribe(map => {
      this.objetos = map;
      this.nodes[0].children = [];
      
      map
        .filter(objeto => !objeto.seccion && objeto.documento === this.documento.id)
        .sort(objetoComparator)
        .forEach(objeto => this.nodes[0].children.push(this.crearNodo(objeto)));
    })
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.objetosSubscription.unsubscribe();
  }

  crearNodo(objeto: IObjeto): TreeNode{
     return {
      id: objeto.id,
      label: `[${objeto.codigo}] ${objeto.nombre}`,
      type: objeto.tipo_objeto,
      data: objeto,
      icon: this.devuelveIcono(objeto),
      expandedIcon: objeto.tipo_objeto === TIPOS.SECCION ? 'fa-folder-open' : null,
      collapsedIcon: objeto.tipo_objeto === TIPOS.SECCION ? 'fa-folder' : null,
      children: this.devuelveHijos(objeto),
      expanded: this.expanded_nodes.includes(objeto.id) ? true : null
    } as TreeNode;
  }

  devuelveIcono(objeto: any): String {
    if (objeto.tipo_objeto === TIPOS.REQUISITO){
      return TIPOS.CONFIG[objeto.tipo_objeto].icon[objeto.tipo];
    } else if (objeto.tipo_objeto === TIPOS.SECCION) {
      return null;
    }
    return TIPOS.CONFIG[objeto.tipo_objeto].icon;
  }

  devuelveHijos(objeto: any): TreeNode[]{
    switch (objeto.tipo_objeto) {
      case TIPOS.CASO_USO:
        return objeto.pasos.sort(objetoComparator).map(paso => {
          return {
            id: `${objeto.id}-paso_${paso.id}`, objeto_padre_id: objeto.id, label: 'Paso ' + (paso.order+1), type: TIPOS.PASO_CASO_USO,
            data: paso, icon: TIPOS.CONFIG[TIPOS.PASO_CASO_USO].icon, expanded: this.expanded_nodes.includes(`${objeto.id}-paso_${paso.id}`),
            children: paso.excepciones.sort(objetoComparator).map(excepcion => {
              return {
                objeto_padre_id: excepcion.paso, objeto_abuelo_id: objeto.id, label: 'Excepcion ' + (excepcion.order+1),
                type: TIPOS.EXCEPCION_PASO_CASO_USO, data: excepcion, icon: TIPOS.CONFIG[TIPOS.EXCEPCION_PASO_CASO_USO].icon
              } as TreeNode
            })
          } as TreeNode;
        });
      case TIPOS.TIPO_OBJETOS:
        return [
          { id: `${objeto.id}-atributos`, label: 'Atributos', type: 'ui-folder', collapsedIcon: 'fa-folder-o',
            expandedIcon: 'fa-folder-open-o', selectable: false, expanded: this.expanded_nodes.includes(`${objeto.id}-atributos`),
            children: objeto.atributos.sort(objetoComparator).map(atributo => {
              return {
                objeto_padre_id: objeto.id, label: atributo.nombre, type: TIPOS.ATRIBUTO, data: atributo, icon: TIPOS.CONFIG[TIPOS.ATRIBUTO].icon
              }
            })
          } as TreeNode,
          { id: `${objeto.id}-componentes`, label: 'Componentes', type: 'ui-folder', collapsedIcon: 'fa-folder-o', 
            expandedIcon: 'fa-folder-open-o', selectable: false, expanded: this.expanded_nodes.includes(`${objeto.id}-componentes`),
            children: objeto.componentes.sort(objetoComparator).map(componente => {
              return {
                objeto_padre_id: objeto.id, label: componente.nombre, type: TIPOS.COMPONENTE, data: componente,
                icon: TIPOS.CONFIG[TIPOS.COMPONENTE].icon
              }
            })
          } as TreeNode,
          { id: `${objeto.id}-expresiones`, label: 'Expresiones Invariante', type: 'ui-folder', collapsedIcon: 'fa-folder-o',
            expandedIcon: 'fa-folder-open-o', selectable: false, expanded: this.expanded_nodes.includes(`${objeto.id}-expresiones`),
            children: objeto.expresiones.sort(objetoComparator).map(expresion => {
              return {
                objeto_padre_id: objeto.id, label: expresion.nombre, type: TIPOS.EXPRESION, data: expresion,
                icon: TIPOS.CONFIG[TIPOS.EXPRESION].icon
              }
            })
          } as TreeNode
        ]
      case TIPOS.TIPO_VALOR:
        return [
          { id: `${objeto.id}-atributos`, label: 'Atributos', type: 'ui-folder', collapsedIcon: 'fa-folder-o',
            expandedIcon: 'fa-folder-open-o', selectable: false, expanded: this.expanded_nodes.includes(`${objeto.id}-atributos`),
            children: objeto.atributos.sort(objetoComparator).map(atributo => {
              return {
                objeto_padre_id: objeto.id, label: atributo.nombre, type: TIPOS.ATRIBUTO, data: atributo, icon: TIPOS.CONFIG[TIPOS.ATRIBUTO].icon
              }
            })
          } as TreeNode,
          { id: `${objeto.id}-expresiones`, label: 'Expresiones Invariante', type: 'ui-folder', collapsedIcon: 'fa-folder-o',
            expandedIcon: 'fa-folder-open-o', selectable: false, expanded: this.expanded_nodes.includes(`${objeto.id}-expresiones`),
            children: objeto.expresiones.sort(objetoComparator).map(expresion => {
              return {
                objeto_padre_id: objeto.id, label: expresion.nombre, type: TIPOS.EXPRESION, data: expresion,
                icon: TIPOS.CONFIG[TIPOS.EXPRESION].icon
              }
            })
          } as TreeNode
        ]
      case TIPOS.ASOCIACION:
        return [
          { id: `${objeto.id}-roles`, label: 'Roles', type: 'ui-folder', collapsedIcon: 'fa-folder-o',
            expandedIcon: 'fa-folder-open-o', selectable: false, expanded: this.expanded_nodes.includes(`${objeto.id}-roles`),
            children: objeto.roles.sort(objetoComparator).map(rol => {
              return {objeto_padre_id: objeto.id, label: rol.nombre, type: TIPOS.ROL, data: rol, icon: TIPOS.CONFIG[TIPOS.ROL].icon}
            })
          } as TreeNode,
          { id: `${objeto.id}-atributos`, label: 'Atributos', type: 'ui-folder', collapsedIcon: 'fa-folder-o',
            expandedIcon: 'fa-folder-open-o', selectable: false, expanded: this.expanded_nodes.includes(`${objeto.id}-atributos`),
            children: objeto.atributos.sort(objetoComparator).map(atributo => {
              return {
                objeto_padre_id: objeto.id, label: atributo.nombre, type: TIPOS.ATRIBUTO, data: atributo, icon: TIPOS.CONFIG[TIPOS.ATRIBUTO].icon
              }
            })
          } as TreeNode,
          { id: `${objeto.id}-expresiones`, label: 'Expresiones Invariante', type: 'ui-folder', collapsedIcon: 'fa-folder-o',
            expandedIcon: 'fa-folder-open-o', selectable: false, expanded: this.expanded_nodes.includes(`${objeto.id}-expresiones`),
            children: objeto.expresiones.sort(objetoComparator).map(expresion => {
              return {
                objeto_padre_id: objeto.id, label: expresion.nombre, type: TIPOS.EXPRESION, data: expresion,
                icon: TIPOS.CONFIG[TIPOS.EXPRESION].icon
              }
            })
          } as TreeNode
        ]
        case TIPOS.OPERACION_SISTEMA:
          return [
            { id: `${objeto.id}-parametros`, label: 'Parámetros', type: 'ui-folder', collapsedIcon: 'fa-folder-o',
              expandedIcon: 'fa-folder-open-o', selectable: false, expanded: this.expanded_nodes.includes(`${objeto.id}-parametros`),
              children: objeto.parametros.sort(objetoComparator).map(parametro => {
                return {
                  objeto_padre_id: objeto.id, label: parametro.nombre, type: TIPOS.PARAMETRO, data: parametro, icon: TIPOS.CONFIG[TIPOS.PARAMETRO].icon
                }
              })
            } as TreeNode,
            { id: `${objeto.id}-expresiones_pre`, label: 'Expresiones de precondicion', type: 'ui-folder',
              collapsedIcon: 'fa-folder-o', expandedIcon: 'fa-folder-open-o', selectable: false,
              expanded: this.expanded_nodes.includes(`${objeto.id}-expresiones_pre`),
              children: objeto.expresiones.filter(exp => exp.tipo === 'PRE').sort(objetoComparator).map(expresion => {
                return {
                  objeto_padre_id: objeto.id, label: expresion.nombre, type: TIPOS.EXPRESION, data: expresion,
                  icon: TIPOS.CONFIG[TIPOS.EXPRESION].icon
                }
              })
            } as TreeNode,
            { id: `${objeto.id}-expresiones_post`, label: 'Expresiones de postcondicion', type: 'ui-folder',
              collapsedIcon: 'fa-folder-o', expandedIcon: 'fa-folder-open-o', selectable: false,
              expanded: this.expanded_nodes.includes(`${objeto.id}-expresiones_post`),
              children: objeto.expresiones.filter(exp => exp.tipo === 'POST').sort(objetoComparator).map(expresion => {
                return {
                  objeto_padre_id: objeto.id, label: expresion.nombre, type: TIPOS.EXPRESION, data: expresion,
                  icon: TIPOS.CONFIG[TIPOS.EXPRESION].icon
                }
              })
            } as TreeNode,
            { id: `${objeto.id}-excepciones`, label: 'Excepciones', type: 'ui-folder', collapsedIcon: 'fa-folder-o',
              expandedIcon: 'fa-folder-open-o', selectable: false,
              expanded: this.expanded_nodes.includes(`${objeto.id}-excepciones`),
              children: objeto.excepciones.sort(objetoComparator).map(excepcion => {
                return {
                  objeto_padre_id: objeto.id, label: excepcion.nombre, type: TIPOS.EXCEPCION_OS, data: excepcion,
                  icon: TIPOS.CONFIG[TIPOS.EXCEPCION_OS].icon
                }
              })
            } as TreeNode
          ]
      case TIPOS.CONFLICTO:
      case TIPOS.DEFECTO:
        return objeto.alternativas.sort(objetoComparator).map(alternativa => {
            return {
              objeto_padre_id: objeto.id, label: alternativa.nombre, type: TIPOS.ALTERNATIVA, data: alternativa,
              icon: TIPOS.CONFIG[TIPOS.ALTERNATIVA].icon
            }
        })
      case TIPOS.REQUISITO_INFORMACION:
        return objeto.datos_especificos.sort(objetoComparator).map(dato => {
            return {
              objeto_padre_id: objeto.id, label: dato.descripcion, type: TIPOS.DATO_ESPECIFICO, data: dato,
              icon: TIPOS.CONFIG[TIPOS.DATO_ESPECIFICO].icon
            }
        })
      case TIPOS.SECCION:
        return this.objetos
          .filter(obj => obj.seccion === objeto.id)
          .sort(objetoComparator)
          .toArray()
          .map(obj => this.crearNodo(obj));
      default:
        return [];
    }
  }

  nodeSelect(event) {
    //console.log(event.node);
  }

  nodeExpand(event) {
    if (!this.expanded_nodes.includes(event.node.id)){
      this.expanded_nodes.push(event.node.id);
    }
  }

  nodeCollapse(event) {
    let index = this.expanded_nodes.indexOf(event.node.id);
    if (index !== -1){
      this.expanded_nodes.splice(index, 1);
    }
  }

  nodeContextMenuSelect(event) {
    if (event.node.type === 'root'){
      this.contextMenu = [];
    } else {
      let disabled_items: boolean = 'ui-folder' == event.node.type;

      let numero_hermanos: number = event.node.parent.children.length;
      let disable_subir: boolean = event.node.parent.children[0] === event.node;
      let disable_bajar: boolean = event.node.parent.children[numero_hermanos - 1] === event.node;

      let menu: MenuItem[] = [
        {label: 'Subir', icon: 'fa-arrow-up', disabled: disabled_items || disable_subir, command: () => {
          this.moveTreeElementUp(event.node);
        }},
        {label: 'Bajar', icon: 'fa-arrow-down', disabled: disabled_items || disable_bajar, command: () => {
          this.moveTreeElementDown(event.node);
        }},
        {label: 'Editar', icon: 'fa-pencil', disabled: disabled_items, command: () => {
          this.onEdit.emit({
            tipo: event.node.type,
            subtipo: event.node.type === TIPOS.REQUISITO ? event.node.data.tipo : null,
            id: event.node.data.id,
            padre_id: event.node.objeto_padre_id,
            abuelo_id: event.node.objeto_abuelo_id
          });
        }},
        /*{label: 'Clonar', icon: 'fa-files-o', disabled: disabled_items, command: () => {
          this.onClone.emit(event.node);
        }},*/
        {label: 'Eliminar', icon: 'fa-trash', disabled: disabled_items || (event.node.type === TIPOS.SECCION && event.node.children.length), command: () => {
          this.removeTreeElement(event.node);
        }}
      ]

      let dato_especifico: MenuItem = {
        label: 'Nuevo dato específico', icon: TIPOS.CONFIG[TIPOS.DATO_ESPECIFICO].icon, command: () => {
          this.onEdit.emit({tipo: TIPOS.DATO_ESPECIFICO, padre_id: event.node.data.id});
        }
      };
      let paso: MenuItem = {
        label: 'Nuevo paso', icon: TIPOS.CONFIG[TIPOS.PASO_CASO_USO].icon, command: () => {
          this.onEdit.emit({tipo: TIPOS.PASO_CASO_USO, padre_id: event.node.data.id});
        }
      };
      let excepcion_paso: MenuItem = {
        label: 'Nueva excepción', icon: TIPOS.CONFIG[TIPOS.EXCEPCION_PASO_CASO_USO].icon, command: () => {
          this.onEdit.emit({
            tipo: TIPOS.EXCEPCION_PASO_CASO_USO, padre_id: event.node.data.id, abuelo_id: event.node.data.caso_uso
          });
        }
      };
      let componente: MenuItem = {
        label: 'Nuevo componente', icon: TIPOS.CONFIG[TIPOS.COMPONENTE].icon, command: () => {
          this.onEdit.emit({ tipo: TIPOS.COMPONENTE, padre_id: event.node.data.id });
        }
      };
      let atributo: MenuItem = {
        label: 'Nuevo atributo', icon: TIPOS.CONFIG[TIPOS.ATRIBUTO].icon, command: () => {
          this.onEdit.emit({
            tipo: TIPOS.ATRIBUTO, tipo_padre: event.node.type, padre_id: event.node.data.id
          });
        }
      };
      let expresion: MenuItem = {
        label: 'Nueva expresión', icon: TIPOS.CONFIG[TIPOS.EXPRESION].icon, command: () => {
          this.onEdit.emit({
            tipo: TIPOS.EXPRESION, tipo_padre: event.node.type, padre_id: event.node.data.id
          });
        }
      };
      let rol: MenuItem = {
        label: 'Nuevo rol', icon: TIPOS.CONFIG[TIPOS.ROL].icon, command: () => {
          this.onEdit.emit({ tipo: TIPOS.ROL, padre_id: event.node.data.id });
        }
      };
      let parametro: MenuItem = {
        label: 'Nuevo parámetro', icon: TIPOS.CONFIG[TIPOS.PARAMETRO].icon, command: () => {
          this.onEdit.emit({ tipo: TIPOS.PARAMETRO, padre_id: event.node.data.id });
        }
      };
      let expresion_pre: MenuItem = {
        label: 'Nueva expresión de precondición', icon: TIPOS.CONFIG[TIPOS.EXPRESION].icon, command: () => {
          this.onEdit.emit({
            tipo: TIPOS.EXPRESION, subtipo: 'PRE', tipo_padre: event.node.type, padre_id: event.node.data.id
          });
        }
      };
      let expresion_post: MenuItem = {
        label: 'Nueva expresión de postcondición', icon: TIPOS.CONFIG[TIPOS.EXPRESION].icon, command: () => {
          this.onEdit.emit({
            tipo: TIPOS.EXPRESION, subtipo: 'POST', tipo_padre: event.node.type, padre_id: event.node.data.id
          });
        }
      };
      let excepcion_os: MenuItem = {
        label: 'Nueva excepción', icon: TIPOS.CONFIG[TIPOS.EXCEPCION_OS].icon, command: () => {
          this.onEdit.emit({ tipo: TIPOS.EXCEPCION_OS, padre_id: event.node.data.id });
        }
      };
      let alternativa: MenuItem = {
        label: 'Nueva alternativa', icon: TIPOS.CONFIG[TIPOS.ALTERNATIVA].icon, command: () => {
          this.onEdit.emit({ tipo: TIPOS.ALTERNATIVA, tipo_padre: event.node.type, padre_id: event.node.data.id });
        }
      };

      let aux_menu: MenuItem[] = [];
      switch(event.node.type){
        case TIPOS.REQUISITO_INFORMACION:
          aux_menu = [ dato_especifico ]
          break;
        case TIPOS.CASO_USO:
          aux_menu = [ paso ];
          break;
        case TIPOS.PASO_CASO_USO:
          aux_menu = [ excepcion_paso ];
          break;
        case TIPOS.TIPO_OBJETOS:
          aux_menu = [ componente, atributo, expresion ];
          break;
        case TIPOS.TIPO_VALOR:
          aux_menu = [ atributo, expresion ];
          break;
        case TIPOS.ASOCIACION:
          aux_menu = [ rol, atributo, expresion ];
          break;
        case TIPOS.OPERACION_SISTEMA:
          aux_menu = [ parametro, expresion_pre, expresion_post, excepcion_os ];
          break;
        case TIPOS.CONFLICTO:
        case TIPOS.DEFECTO:
          aux_menu = [ alternativa ];
          break;
      }

      this.contextMenu = aux_menu.concat(menu);
    }
  }

  moveTreeElementUp(nodo: IEventTreeNode): void {
    let tipo_api = TIPOS.CONFIG[nodo.type].is_rem_object ? 'objetos' : TIPOS.CONFIG[nodo.type].api_reference;
    this.objetoService.moveUpElement(nodo.data.id, tipo_api)
      .then(nodo_movido => {
        if(TIPOS.CONFIG[nodo.type].is_rem_object){
          this.objetoStreamService.updateMap(this.objetos.withMutations(map => {          
            let objeto_a_intercambiar = map.find(obj => {
              return obj.seccion === nodo_movido.seccion && nodo_movido.order === obj.order;
            });
            objeto_a_intercambiar.order += 1;

            map.set(nodo_movido.id, nodo_movido).set(objeto_a_intercambiar.id, objeto_a_intercambiar);
          }));
        }else if(nodo.type === TIPOS.EXCEPCION_PASO_CASO_USO){
          this.objetoStreamService.updateMap(this.objetos.withMutations(map => {
            let abuelo_nodo_movido = map.get(nodo.objeto_abuelo_id);
            let padre_nodo_movido_index = abuelo_nodo_movido.pasos.findIndex(paso => paso.id === nodo.objeto_padre_id);
            let hermanos: Array<any> = abuelo_nodo_movido.pasos[padre_nodo_movido_index].excepciones;

            hermanos.find(hermano => hermano.order === nodo_movido.order).order +=1;
            hermanos.find(hermano => hermano.id === nodo.data.id).order -= 1;
            
            abuelo_nodo_movido.pasos[padre_nodo_movido_index].excepciones = hermanos;
            
            map.delete(nodo.objeto_abuelo_id).set(nodo.objeto_abuelo_id, abuelo_nodo_movido);
          }));
        }else{
          this.objetoStreamService.updateMap(this.objetos.withMutations(map => {
            let padre_nodo_movido = map.get(nodo.objeto_padre_id);
            let hermanos: Array<any> = padre_nodo_movido[TIPOS.CONFIG[nodo.type].related_name];
            
            hermanos.find(hermano => hermano.order === nodo_movido.order).order +=1;
            hermanos.find(hermano => hermano.id === nodo.data.id).order -= 1;
            
            padre_nodo_movido[TIPOS.CONFIG[nodo.type].related_name] = hermanos;
            
            map.delete(nodo.objeto_padre_id).set(nodo.objeto_padre_id, padre_nodo_movido);
          }));
        }
      })
      .catch(error => this.growlMessagesService.newMessage(
        { severity:'error', summary: nodo.data.codigo || 'Error' , detail:'Error al mover el elemento.' }
      ));
  }

  moveTreeElementDown(nodo: IEventTreeNode): void {
    let tipo_api = TIPOS.CONFIG[nodo.type].is_rem_object ? 'objetos' : TIPOS.CONFIG[nodo.type].api_reference;
    this.objetoService.moveDownElement(nodo.data.id, tipo_api)
      .then(nodo_movido => {
        if(TIPOS.CONFIG[nodo.type].is_rem_object){
          this.objetoStreamService.updateMap(this.objetos.withMutations(map => {          
            let objeto_a_intercambiar = map.find(obj => {
              return obj.seccion === nodo_movido.seccion && nodo_movido.order === obj.order;
            });
            objeto_a_intercambiar.order -= 1;

            map.set(nodo_movido.id, nodo_movido).set(objeto_a_intercambiar.id, objeto_a_intercambiar);
          }));
        }else if(nodo.type === TIPOS.EXCEPCION_PASO_CASO_USO){
          this.objetoStreamService.updateMap(this.objetos.withMutations(map => {
            let abuelo_nodo_movido = map.get(nodo.objeto_abuelo_id);
            let padre_nodo_movido_index = abuelo_nodo_movido.pasos.findIndex(paso => paso.id === nodo.objeto_padre_id);
            let hermanos: Array<any> = abuelo_nodo_movido.pasos[padre_nodo_movido_index].excepciones;

            hermanos.find(hermano => hermano.order === nodo_movido.order).order -=1;
            hermanos.find(hermano => hermano.id === nodo.data.id).order += 1;
            
            abuelo_nodo_movido.pasos[padre_nodo_movido_index].excepciones = hermanos;
            
            map.delete(nodo.objeto_abuelo_id).set(nodo.objeto_abuelo_id, abuelo_nodo_movido);
          }));
        }else{
          this.objetoStreamService.updateMap(this.objetos.withMutations(map => {
            let padre_nodo_movido = map.get(nodo.objeto_padre_id);
            let hermanos: Array<any> = padre_nodo_movido[TIPOS.CONFIG[nodo.type].related_name];
            
            hermanos.find(hermano => hermano.order === nodo_movido.order).order -=1;
            hermanos.find(hermano => hermano.id === nodo.data.id).order += 1;
            
            padre_nodo_movido[TIPOS.CONFIG[nodo.type].related_name] = hermanos;
            
            map.delete(nodo.objeto_padre_id).set(nodo.objeto_padre_id, padre_nodo_movido);
          }));
        }
      })
      .catch(error => this.growlMessagesService.newMessage(
        { severity:'error', summary: nodo.data.codigo || 'Error' , detail:'Error al mover el elemento.' }
      ));
  }

  removeTreeElement(nodo: IEventTreeNode): void {
    if (confirm(`¿Está seguro que desea eliminar el elemento ${nodo.label}?`)) {
      let tipo_api = TIPOS.CONFIG[nodo.type].api_reference;
      this.objetoService.deleteElement(nodo.data.id, tipo_api)
          .then(() => {
            if(TIPOS.CONFIG[nodo.type].is_rem_object){
              this.objetoStreamService.updateMap(this.objetos.withMutations(map => {
                let nodo_borrado = map.get(nodo.data.id);
                map.filter(obj => obj.seccion === nodo_borrado.seccion && obj.order > nodo_borrado.order).toArray()
                  .forEach(obj => { obj.order -= 1; map.set(obj.id, obj); });
                map.delete(nodo.data.id);
              }));
            }else if(nodo.type === TIPOS.EXCEPCION_PASO_CASO_USO){
              this.objetoStreamService.updateMap(this.objetos.withMutations(map => {
                let abuelo_nodo_borrado = map.get(nodo.objeto_abuelo_id);
                let padre_nodo_borrado_index = abuelo_nodo_borrado.pasos.findIndex(paso => paso.id === nodo.objeto_padre_id);
                let hermanos: Array<any> = abuelo_nodo_borrado.pasos[padre_nodo_borrado_index].excepciones;
                let nodo_borrado_index = hermanos.findIndex(excep => excep.id === nodo.data.id);

                hermanos.filter(obj => obj.order > hermanos[nodo_borrado_index].order).forEach(obj => obj.order -= 1 );
                hermanos.splice(nodo_borrado_index, 1);
                abuelo_nodo_borrado.pasos[padre_nodo_borrado_index].excepciones = hermanos;
                
                map.delete(nodo.objeto_abuelo_id).set(nodo.objeto_abuelo_id, abuelo_nodo_borrado);
              }));
            }else{
              this.objetoStreamService.updateMap(this.objetos.withMutations(map => {
                let padre_nodo_borrado = map.get(nodo.objeto_padre_id);
                let hermanos: Array<any> = padre_nodo_borrado[TIPOS.CONFIG[nodo.type].related_name];
                let nodo_borrado_index = hermanos.findIndex(obj => obj.id === nodo.data.id);

                hermanos.filter(obj => obj.order > hermanos[nodo_borrado_index].order).forEach(obj => obj.order -= 1 );
                hermanos.splice(nodo_borrado_index, 1);
                padre_nodo_borrado[TIPOS.CONFIG[nodo.type].related_name] = hermanos;
                
                map.delete(nodo.objeto_padre_id).set(nodo.objeto_padre_id, padre_nodo_borrado);
              }));
            }
            this.growlMessagesService.newMessage(
              { severity:'success', summary: nodo.data.codigo || 'OK' , detail:'Elemento eliminado con éxito.' }
            );
          })
          .catch(error => this.growlMessagesService.newMessage(
            { severity:'error', summary: nodo.data.codigo || 'Error' , detail:'Error al eliminar el elemento.' }
          ));
    }
  }

}
