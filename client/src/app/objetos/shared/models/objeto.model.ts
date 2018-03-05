export interface IObjeto {
    id?: number;
    tipo_objeto?: string;
    documento: number;
    numero?: number;
    codigo?: string;
    nombre?: string;
    order?: number;
    version?: string;
    fecha_version?: Date|string;
    autores?: number[];
    fuentes?: number[];
    comentarios?: string;
    trazabilidad_desde?: number[];
    seccion?: number;
    logs?: number[];
    creado?: Date;
    modificado?: Date;
};

export abstract class Objeto {
    public id?: number;
    public tipo_objeto?: string;
    public documento: number;
    public numero?: number;
    public codigo?: string;
    public nombre?: string;
    public order?: number;
    public version?: string;
    public fecha_version?: Date|string;
    public autores?: number[];
    public fuentes?: number[];
    public comentarios?: string;
    public trazabilidad_desde?: number[];
    public seccion?: number;
    public logs?: number[];
    public creado?: Date;
    public modificado?: Date;

    constructor(obj: IObjeto = {} as IObjeto) {
        let {
            id = null,
            tipo_objeto = null,
            documento = null,
            numero = null,
            codigo = null,
            nombre = '',
            order = null,
            version = '1.0',
            fecha_version = null,
            autores = [],
            fuentes = [],
            comentarios = '',
            trazabilidad_desde = [],
            seccion = null,
            logs = [],
            creado = null,
            modificado = null
        } = obj;

        this.id = id;
        this.tipo_objeto = tipo_objeto;
        this.documento = documento;
        this.numero = numero;
        this.codigo = codigo;
        this.nombre = nombre;
        this.order = order;
        this.version = version;
        this.fecha_version = fecha_version;
        this.autores = autores;
        this.fuentes = fuentes;
        this.comentarios = comentarios;
        this.trazabilidad_desde = trazabilidad_desde;
        this.seccion = seccion;
        this.logs = logs;
        this.creado = creado;
        this.modificado = modificado;
    }
}
