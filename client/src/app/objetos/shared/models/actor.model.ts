import { IObjeto, Objeto } from './objeto.model';
import * as TIPOS from '../tipos';

export interface IActor extends IObjeto {
    descripcion?: string;
}

export class Actor extends Objeto {
    public descripcion?: string;

    constructor(actor: IActor = { tipo_objeto: TIPOS.ACTOR } as IActor) {
        super(actor);

        let {
            descripcion = ''
        } = actor;

        this.descripcion = descripcion;
    }
}