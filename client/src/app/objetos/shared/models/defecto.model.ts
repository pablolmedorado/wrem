import { IObjeto, Objeto } from './objeto.model';
import * as TIPOS from '../tipos';
import { IAlternativa } from './alternativa.model';

export interface IDefecto extends IObjeto {
    tipo?: string;
    descripcion?: string;
    solucion?: string;
    importancia?: string;
    urgencia?: string;
    estado?: string;
    alternativas?: IAlternativa[];
}

export class Defecto extends Objeto {
    public tipo?: string;
    public descripcion?: string;
    public solucion?: string;
    public importancia?: string;
    public urgencia?: string;
    public estado?: string;

    constructor(defecto: IDefecto = { tipo_objeto: TIPOS.DEFECTO } as IDefecto) {
        super(defecto);

        let {
            tipo = 'PD',
            descripcion = '',
            solucion = '',
            importancia = 'PD',
            urgencia = 'PD',
            estado = 'PD'
        } = defecto;

        this.tipo = tipo;
        this.descripcion = descripcion;
        this.solucion = solucion;
        this.importancia = importancia;
        this.urgencia = urgencia;
        this.estado = estado;
    }
}
