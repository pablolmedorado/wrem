export interface IGrupo {
    id?: number;
    nombre: string;
    usuarios?: number[];
    administrador?: number;
    creado?: Date;
    modificado?: Date;
}

export class Grupo {
    public id?: number;
    public nombre: string;
    public usuarios?: number[];
    public administrador?: number;
    public creado?: Date;
    public modificado?: Date;

    constructor(obj: IGrupo) {
        let {
            id = null,
            nombre = '',
            usuarios = [],
            administrador = null,
            creado = null,
            modificado = null
        } = obj;
        
        this.id = id;
        this.nombre = nombre;
        this.usuarios = usuarios;
        this.administrador = administrador;
        this.creado = creado;
        this.modificado = modificado;
    }
}
