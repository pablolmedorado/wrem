import { IProyecto } from '../../proyectos/shared/proyecto.model';

export interface IDocumento {
    id?: number;
    nombre: string;
    autor?: number;
    version?: string;
    proyecto: number | IProyecto;
    organizacion_por?: number;
    organizacion_para?: number;
    objetos?: number[];
    comentarios?: string;
    logs?: number[];
    creado?: Date;
    modificado?: Date;
    editable?: boolean;
}

export class Documento {
    public id: number;
    public nombre: string;
    public autor: number;
    public version: string;
    public proyecto: number | IProyecto;
    public organizacion_por: number;
    public organizacion_para: number;
    public objetos: number[];
    public comentarios: string;
    public logs: number[];
    public creado: Date;
    public modificado: Date;
    public editable: boolean;

    constructor(obj: IDocumento) {
        let {
            id = null,
            nombre = '',
            autor = null,
            version = '1.0',
            organizacion_por = null,
            organizacion_para = null,
            objetos = null,
            comentarios = '',
            logs = [],
            creado = null,
            modificado = null,
            editable = true
        } = obj;
        
        this.id = id;
        this.nombre = nombre;
        this.autor = autor;
        this.version = version;
        this.proyecto = obj.proyecto;
        this.organizacion_por = organizacion_por;
        this.organizacion_para = organizacion_para;
        this.objetos = objetos;
        this.comentarios = comentarios;
        this.logs = logs;
        this.creado = creado;
        this.modificado = modificado;
        this.editable = editable;
    }
}
