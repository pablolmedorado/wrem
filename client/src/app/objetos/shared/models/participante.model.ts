import { IObjeto, Objeto } from './objeto.model';
import * as TIPOS from '../tipos';

export interface IParticipante extends IObjeto {
    organizacion?: number;
    rol?: string;
    es_cliente?: boolean;
    es_desarrollador?: boolean;
    es_usuario?: boolean;
}

export class Participante extends Objeto {
    public organizacion?: number;
    public rol?: string;
    public es_cliente?: boolean;
    public es_desarrollador?: boolean;
    public es_usuario?: boolean;

    constructor(participante: IParticipante = { tipo_objeto: TIPOS.PARTICIPANTE } as IParticipante) {
        super(participante);

        let {
            organizacion = null,
            rol = '',
            es_cliente = false,
            es_desarrollador = false,
            es_usuario = false
        } = participante;

        this.organizacion = organizacion;
        this.rol = rol;
        this.es_cliente = es_cliente;
        this.es_desarrollador = es_desarrollador;
        this.es_usuario = es_usuario;
    }
}