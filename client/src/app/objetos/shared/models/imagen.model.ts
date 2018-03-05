import { IObjeto, Objeto } from './objeto.model';
import * as TIPOS from '../tipos';

export interface IImagen extends IObjeto {
    imagen?: string;
}

export class Imagen extends Objeto {
    public imagen?: string;

    constructor(img: IImagen = { tipo_objeto: TIPOS.IMAGEN } as IImagen) {
        super(img);

        let {
            imagen = ''
        } = img;

        this.imagen = imagen;
    }
}