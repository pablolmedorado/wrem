import { IObjeto, Objeto } from './objeto.model';
import * as TIPOS from '../tipos';
import { IAtributo } from './atributo.model';
import { IExpresion } from './expresion.model';

export interface IRol {
    id?: number;
    asociacion?: number;
    order?: number;
    nombre?: string;
    tipo_base?: number;
    tipo?: string;
    multiplicidad_inferior?: string;
    multiplicidad_superior?: string;
    tipo_propiedad?: string;
    valor?: string;
    descripcion?: string;
    comentarios?: string;
}

export class Rol {
    public id?: number;
    public asociacion: number;
    public order?: number;
    public nombre?: string;
    public tipo_base?: number;
    public tipo?: string;
    public multiplicidad_inferior?: string;
    public multiplicidad_superior?: string;
    public tipo_propiedad?: string;
    public valor?: string;
    public descripcion?: string;
    public comentarios?: string;

    constructor(componente: IRol) {
        let {
            id = null,
            order = null,
            nombre = '',
            tipo_base = null,
            tipo = 'S',
            multiplicidad_inferior = '',
            multiplicidad_superior = '',
            tipo_propiedad = 'V',
            valor = '',
            descripcion = '',
            comentarios = '',
        } = componente;

        this.id = id;
        this.asociacion = componente.asociacion;
        this.order = order;
        this.nombre = nombre;
        this.tipo_base = tipo_base;
        this.tipo = tipo;
        this.multiplicidad_inferior = multiplicidad_inferior;
        this.multiplicidad_superior = multiplicidad_superior;
        this.tipo_propiedad = tipo_propiedad;
        this.valor = valor;
        this.descripcion = descripcion;
        this.comentarios = comentarios;
    }
}

export interface IAsociacion extends IObjeto {
    es_derivada?: boolean;
    descripcion?: string;
    roles?: IRol[];
    atributos?: IAtributo[];
    expresiones_invariante?: IExpresion[];
}

export class Asociacion extends Objeto {
    public es_derivada?: boolean;
    public descripcion?: string;

    constructor(asociacion: IAsociacion = { tipo_objeto: TIPOS.ASOCIACION } as IAsociacion) {
        super(asociacion);

        let {
            es_derivada = false,
            descripcion = ''
        } = asociacion;

        this.es_derivada = es_derivada;
        this.descripcion = descripcion;
    }
}