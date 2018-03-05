export interface IExpresion {
    id?: number;
    tipo_objeto: number;
    tipo_valor: number;
    asociacion: number;
    operacion_sistema: number;
    order?: number;
    nombre?: string;
    tipo?: string;
    expresion_lenguaje_natural?: string;
    expresion_ocl?: string;
    comentarios?: string;
}

export class Expresion {
    public id?: number;
    public tipo_objeto: number;
    public tipo_valor: number;
    public asociacion: number;
    public operacion_sistema: number;
    public order?: number;
    public nombre?: string;
    public tipo?: string;
    public expresion_lenguaje_natural?: string;
    public expresion_ocl?: string;
    public comentarios?: string;

    constructor(expresion: IExpresion) {
        let {
            id = null,
            order = null,
            nombre = '',
            tipo = null,
            expresion_lenguaje_natural = '',
            expresion_ocl = '',
            comentarios = ''
        } = expresion;

        this.id = id;
        this.tipo_objeto = expresion.tipo_objeto;
        this.tipo_valor = expresion.tipo_valor;
        this.asociacion = expresion.asociacion;
        this.operacion_sistema = expresion.operacion_sistema;
        this.order = order;
        this.nombre = nombre;
        this.tipo = tipo;
        this.expresion_lenguaje_natural = expresion_lenguaje_natural;
        this.expresion_ocl = expresion_ocl;
        this.comentarios = comentarios;
    }
}
