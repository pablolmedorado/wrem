export interface IAtributo {
    id?: number;
    tipo_objeto: number;
    tipo_valor: number;
    asociacion: number;
    order?: number;
    nombre?: string;
    tipo_base_default?: number;
    tipo_base?: number;
    tipo?: string;
    multiplicidad_inferior?: string;
    multiplicidad_superior?: string;
    tipo_propiedad?: string;
    valor?: string;
    descripcion?: string;
    comentarios?: string;
}

export class Atributo{
    public id?: number;
    public tipo_objeto: number;
    public tipo_valor: number;
    public asociacion: number;
    public order?: number;
    public nombre?: string;
    public tipo_base_default?: number;
    public tipo_base?: number;
    public tipo?: string;
    public multiplicidad_inferior?: string;
    public multiplicidad_superior?: string;
    public tipo_propiedad?: string;
    public valor?: string;
    public descripcion?: string;
    public comentarios?: string;

    constructor(atributo: IAtributo) {
        let {
            id = null,
            order = null,
            nombre = '',
            tipo_base_default = null,
            tipo_base = null,
            tipo = 'S',
            multiplicidad_inferior = null,
            multiplicidad_superior = null,
            tipo_propiedad = 'V',
            valor = '',
            descripcion = '',
            comentarios = ''
        } = atributo;

        this.id = id
        this.tipo_objeto = atributo.tipo_objeto;
        this.tipo_valor = atributo.tipo_valor;
        this.asociacion = atributo.asociacion;
        this.order = order;
        this.nombre = nombre;
        this.tipo_base_default = tipo_base_default;
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
