export interface IAlternativa {
    id?: number;
    conflicto: number;
    defecto: number;
    order?: number;
    nombre?: string;
    autores?: number[];
    descripcion?: string;
    comentarios?: string;
}

export class Alternativa {
    public id?: number;
    public conflicto: number;
    public defecto: number;
    public order?: number;
    public nombre?: string;
    public autores?: number[];
    public descripcion?: string;
    public comentarios?: string;

    constructor(alternativa: IAlternativa) {
        let {
            id = null,
            order = null,
            nombre = '',
            autores = [],
            descripcion = '',
            comentarios = ''
        } = alternativa;

        this.id = id;
        this.conflicto = alternativa.conflicto;
        this.defecto = alternativa.defecto;
        this.order = order;
        this.nombre = nombre;
        this.autores = autores;
        this.descripcion = descripcion;
        this.comentarios = comentarios;
    }
}