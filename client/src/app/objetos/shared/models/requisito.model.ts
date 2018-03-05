import { IObjeto, Objeto } from './objeto.model';
import * as TIPOS from '../tipos';

export interface IRequisito extends IObjeto {
    tipo: string;
    descripcion?: string;
    importancia?: string;
    urgencia?: string;
    estado_desarrollo?: string;
    estabilidad?: string;
}

export class Requisito extends Objeto {
    public tipo: string;
    public descripcion?: string;
    public importancia?: string;
    public urgencia?: string;
    public estado_desarrollo?: string;
    public estabilidad?: string;

    constructor(requisito: IRequisito = { tipo_objeto: TIPOS.REQUISITO } as IRequisito) {
        super(requisito);

        let {
            descripcion = '',
            importancia = 'PD',
            urgencia = 'PD',
            estado_desarrollo = 'PD',
            estabilidad = 'PD'
        } = requisito;

        this.tipo = requisito.tipo;
        this.descripcion = descripcion;
        this.importancia = importancia;
        this.urgencia = urgencia;
        this.estado_desarrollo = estado_desarrollo;
        this.estabilidad = estabilidad;
    }
}