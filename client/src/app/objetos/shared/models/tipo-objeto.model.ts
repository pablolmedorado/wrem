import { IObjeto, Objeto } from './objeto.model';
import * as TIPOS from '../tipos';
import { IAtributo } from './atributo.model';
import { IExpresion } from './expresion.model';

export interface IComponente {
    id?: number;
    tipo_objeto: number;
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

export class Componente {
    public id?: number;
    public tipo_objeto: number;
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

    constructor(componente: IComponente) {
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
        this.tipo_objeto = componente.tipo_objeto;
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

export interface ITipoObjeto extends IObjeto {
    es_abstracto?: boolean;
    supertipo?: number;
    subtipo?: string;
    descripcion?: string;
    componentes?: IComponente[];
    atributos?: IAtributo[];
    expresiones_invariante?: IExpresion[];
}

export class TipoObjeto extends Objeto {
    public es_abstracto?: boolean;
    public supertipo?: number;
    public subtipo?: string;
    public descripcion?: string;
    public componentes?: IComponente[];
    public atributos?: IAtributo[];
    public expresiones_invariante?: IExpresion[];

    constructor(tipo_objeto: ITipoObjeto = { tipo_objeto: TIPOS.TIPO_OBJETOS } as ITipoObjeto) {
        super(tipo_objeto);

        let {
            es_abstracto = false,
            supertipo = null,
            subtipo = null,
            descripcion = '',
            componentes = [],
            atributos = [],
            expresiones_invariante = []
        } = tipo_objeto;

        this.es_abstracto = es_abstracto;
        this.supertipo = supertipo;
        this.subtipo = subtipo;
        this.descripcion = descripcion;
        this.componentes = componentes;
        this.atributos = atributos;
        this.expresiones_invariante = expresiones_invariante;
    }
}