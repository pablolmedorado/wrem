import { IObjeto, Objeto } from './objeto.model';
import * as TIPOS from '../tipos';

export interface IOrganizacion extends IObjeto {
    direccion?: string;
    telefono?: string;
    email?: string;
}

export class Organizacion extends Objeto {
    public direccion?: string;
    public telefono?: string;
    public email?: string;

    constructor(organizacion: IOrganizacion = { tipo_objeto: TIPOS.ORGANIZACION } as IOrganizacion) {
        super(organizacion);

        let {
            direccion = '',
            telefono = '',
            email = ''
        } = organizacion;

        this.direccion = direccion;
        this.telefono = telefono;
        this.email = email;
    }
}