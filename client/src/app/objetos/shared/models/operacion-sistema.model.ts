import { IObjeto, Objeto } from './objeto.model';
import * as TIPOS from '../tipos';
import { IExpresion } from './expresion.model';

export interface IParametro {
    id?: number;
    operacion_sistema?: number;
    order?: number;
    nombre?: string;
    tipo_base_default?: number;
    tipo_base?: number;
    tipo?: string;
    multiplicidad_inferior?: string;
    multiplicidad_superior?: string;
    descripcion?: string;
    comentarios?: string;
}

export class Parametro {
    public id?: number;
    public operacion_sistema: number;
    public order?: number;
    public nombre?: string;
    public tipo_base_default?: number;
    public tipo_base?: number;
    public tipo?: string;
    public multiplicidad_inferior?: string;
    public multiplicidad_superior?: string;
    public descripcion?: string;
    public comentarios?: string;

    constructor(parametro: IParametro) {
        let {
            id = null,
            order = null,
            nombre = '',
            tipo_base_default = null,
            tipo_base = null,
            tipo = 'S',
            multiplicidad_inferior = '',
            multiplicidad_superior = '',
            descripcion = '',
            comentarios = '',
        } = parametro;

        this.id = id;
        this.operacion_sistema = parametro.operacion_sistema;
        this.order = order;
        this.nombre = nombre;
        this.tipo_base_default = tipo_base_default;
        this.tipo_base = tipo_base;
        this.tipo = tipo;
        this.multiplicidad_inferior = multiplicidad_inferior;
        this.multiplicidad_superior = multiplicidad_superior;
        this.descripcion = descripcion;
        this.comentarios = comentarios;
    }
}

export interface IExcepcionOS {
    id?: number;
    operacion_sistema?: number;
    order?: number;
    nombre?: string;
    condicion_lenguaje_natural?: string;
    condicion_ocl?: string;
    expresion_lenguaje_natural?: string;
    expresion_ocl?: string;
    comentarios?: string;
}

export class ExcepcionOS {
    public id?: number;
    public operacion_sistema: number;
    public order?: number;
    public nombre?: string;
    public condicion_lenguaje_natural?: string;
    public condicion_ocl?: string;
    public expresion_lenguaje_natural?: string;
    public expresion_ocl?: string;
    public comentarios?: string;

    constructor(parametro: IExcepcionOS) {
        let {
            id = null,
            order = null,
            nombre = '',
            condicion_lenguaje_natural = '',
            condicion_ocl = '',
            expresion_lenguaje_natural = '',
            expresion_ocl = '',
            comentarios = '',
        } = parametro;

        this.id = id;
        this.operacion_sistema = parametro.operacion_sistema;
        this.order = order;
        this.nombre = nombre;
        this.condicion_lenguaje_natural = condicion_lenguaje_natural;
        this.condicion_ocl = condicion_ocl;
        this.expresion_lenguaje_natural = expresion_lenguaje_natural;
        this.expresion_ocl = expresion_ocl;
        this.comentarios = comentarios;
    }
}

export interface IOperacionSistema extends IObjeto {
    tipo_resultado?: string;
    descripcion?: string;
    excepciones?: IExcepcionOS[];
    expresiones?: IExpresion[];
    parametros?: IParametro[];
}

export class OperacionSistema extends Objeto {
    public tipo_resultado?: string;
    public descripcion?: string;

    constructor(operacion_sistema: IOperacionSistema = { tipo_objeto: TIPOS.OPERACION_SISTEMA } as IOperacionSistema) {
        super(operacion_sistema);

        let {
            tipo_resultado = '',
            descripcion = ''
        } = operacion_sistema;

        this.tipo_resultado = tipo_resultado;
        this.descripcion = descripcion;
    }
}