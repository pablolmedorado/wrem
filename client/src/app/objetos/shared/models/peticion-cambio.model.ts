import { IObjeto, Objeto } from './objeto.model';
import * as TIPOS from '../tipos';

export interface IPeticionCambio extends IObjeto {
    descripcion?: string;
    analisis?: string;
    importancia?: string;
    urgencia?: string;
    estado?: string;
}

export class PeticionCambio extends Objeto {
    public descripcion?: string;
    public analisis?: string;
    public importancia?: string;
    public urgencia?: string;
    public estado?: string;

    constructor(peticion_cambio: IPeticionCambio = { tipo_objeto: TIPOS.PETICION_CAMBIO } as IPeticionCambio) {
        super(peticion_cambio);

        let {
            descripcion = '',
            analisis = '',
            importancia = 'PD',
            urgencia = 'PD',
            estado = 'PD'
        } = peticion_cambio;

        this.descripcion = descripcion;
        this.analisis = analisis;
        this.importancia = importancia;
        this.urgencia = urgencia;
        this.estado = estado;
    }
}