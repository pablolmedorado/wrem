export interface IProyecto {
    id?: number;
    nombre: string;
    autor?: number;
    fecha_ultima_apertura?: Date;
    usuario_ultima_apertura?: number;
    grupos?: number[];
    documentos?: number[];
    logs?: number[];
    creado?: Date;
    modificado?: Date;
    editable?: boolean;
}

export class Proyecto {
    public id?: number;
    public nombre: string;
    public autor?: number;
    public fecha_ultima_apertura?: Date;
    public usuario_ultima_apertura?: number;
    public grupos?: number[];
    public documentos?: number[];
    public logs?: number[];
    public creado?: Date;
    public modificado?: Date;
    public editable?: boolean;

    constructor(obj: IProyecto) {
        let {
            id = null,
            nombre = '',
            autor = null,
            fecha_ultima_apertura = null,
            usuario_ultima_apertura = null,
            grupos = [],
            documentos = [],
            logs = [],
            creado = null,
            modificado = null,
            editable = true
        } = obj;

        this.id = id;
        this.nombre = nombre;
        this.autor = autor;
        this.fecha_ultima_apertura = fecha_ultima_apertura;
        this.usuario_ultima_apertura = usuario_ultima_apertura;
        this.grupos = grupos;
        this.documentos = documentos;
        this.logs = logs;
        this.creado = creado;
        this.modificado = modificado;
        this.editable = editable;
    }
}
