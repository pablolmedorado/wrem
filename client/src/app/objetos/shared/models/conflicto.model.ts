import { IObjeto, Objeto } from './objeto.model';
import * as TIPOS from '../tipos';
import { IAlternativa } from './alternativa.model';

export interface IConflicto extends IObjeto {
    descripcion?: string;
    solucion?: string;
    importancia?: string;
    urgencia?: string;
    estado?: string;
    alternativas?: IAlternativa[];
}

export class Conflicto extends Objeto {
    public descripcion?: string;
    public solucion?: string;
    public importancia?: string;
    public urgencia?: string;
    public estado?: string;

    constructor(conflicto: IConflicto = { tipo_objeto: TIPOS.CONFLICTO } as IConflicto) {
        super(conflicto);

        let {
            descripcion = '',
            solucion = '',
            importancia = 'PD',
            urgencia = 'PD',
            estado = 'PD'
        } = conflicto;

        this.descripcion = descripcion;
        this.solucion = solucion;
        this.importancia = importancia;
        this.urgencia = urgencia;
        this.estado = estado;
    }
}
