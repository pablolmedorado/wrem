import { IObjeto, Objeto } from './objeto.model';
import * as TIPOS from '../tipos';

export interface ISeccion extends IObjeto {
}

export class Seccion extends Objeto {
    constructor(seccion: ISeccion = { tipo_objeto: TIPOS.SECCION } as ISeccion) {
        super(seccion);
    }
}