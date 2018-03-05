import { IObjeto, Objeto } from './objeto.model';
import * as TIPOS from '../tipos';

export interface IObjetivo extends IObjeto {
    descripcion?: string;
    importancia?: string;
    urgencia?: string;
    estado_desarrollo?: string;
    estabilidad?: string;
    padre?: number;
}

export class Objetivo extends Objeto {
    public descripcion?: string;
    public importancia?: string;
    public urgencia?: string;
    public estado_desarrollo?: string;
    public estabilidad?: string;
    public padre?: number;

    constructor(seccion: IObjetivo = { tipo_objeto: TIPOS.OBJETIVO } as IObjetivo) {
        super(seccion);

        let {
            descripcion = '',
            importancia = 'PD',
            urgencia = 'PD',
            estado_desarrollo = 'PD',
            estabilidad = 'PD',
            padre = null
        } = seccion;

        this.descripcion = descripcion;
        this.importancia = importancia;
        this.urgencia = urgencia;
        this.estado_desarrollo = estado_desarrollo;
        this.estabilidad = estabilidad;
        this.padre = padre;
    }
}
