import { IObjeto, Objeto } from './objeto.model';
import * as TIPOS from '../tipos';
import { IAtributo } from './atributo.model';
import { IExpresion } from './expresion.model';

export interface ITipoValor extends IObjeto {
    definicion?: string;
    descripcion?: string;
    atributos?: IAtributo[];
    expresiones_invariante?: IExpresion[];
}

export class TipoValor extends Objeto {
    public definicion?: string;
    public descripcion?: string;

    constructor(actor: ITipoValor = { tipo_objeto: TIPOS.TIPO_VALOR } as ITipoValor) {
        super(actor);

        let {
            definicion = '',
            descripcion = ''
        } = actor;

        this.definicion = definicion;
        this.descripcion = descripcion;
    }
}