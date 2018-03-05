import { IObjeto, Objeto } from './objeto.model';
import * as TIPOS from '../tipos';

export interface IReunion extends IObjeto {
    lugar?: string;
    fecha?: Date;
    asistentes?: number[];
    resultados?: string;
}

export class Reunion extends Objeto {
    public lugar?: string;
    public fecha?: Date;
    public asistentes?: number[];
    public resultados?: string;

    constructor(reunion: IReunion = { tipo_objeto: TIPOS.REUNION } as IReunion) {
        super(reunion);

        let {
            lugar = '',
            fecha = null,
            asistentes = [],
            resultados = ''
        } = reunion;

        this.lugar = lugar;
        this.fecha = fecha;
        this.asistentes = asistentes;
        this.resultados = resultados;
    }
}
