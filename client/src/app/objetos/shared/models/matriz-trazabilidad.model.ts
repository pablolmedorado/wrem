import { IObjeto, Objeto } from './objeto.model';
import * as TIPOS from '../tipos';

export interface IMatrizTrazabilidad extends IObjeto {
    tipo_filas?: number;
    subtipo_filas?: string;
    tipo_columnas?: number;
    subtipo_columnas?: string;
}

export class MatrizTrazabilidad extends Objeto {
    public tipo_filas?: number;
    public subtipo_filas?: string;
    public tipo_columnas?: number;
    public subtipo_columnas?: string;

    constructor(matriz: IMatrizTrazabilidad = { tipo_objeto: TIPOS.MATRIZ_TRAZABILIDAD } as IMatrizTrazabilidad) {
        super(matriz);

        let {
            tipo_filas = null,
            subtipo_filas = null,
            tipo_columnas = null,
            subtipo_columnas = null,
        } = matriz;

        this.tipo_filas = tipo_filas;
        this.subtipo_filas = subtipo_filas;
        this.tipo_columnas = tipo_columnas;
        this.subtipo_columnas = subtipo_columnas;
    }
}