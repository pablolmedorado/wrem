import { Objeto, IObjeto } from './objeto.model';
import * as TIPOS from '../tipos';

export interface IParrafo extends IObjeto {
    texto?: string;
}

export class Parrafo extends Objeto {
    public texto?: string;

    constructor(parrafo: IParrafo = { tipo_objeto: TIPOS.PARRAFO } as IParrafo) {
        super(parrafo);

        let {
            texto = ''
        } = parrafo;

        this.texto = texto;
    }
}