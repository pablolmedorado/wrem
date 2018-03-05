import { IRequisito, Requisito } from './requisito.model';
import * as TIPOS from '../tipos';

export interface IDatoEspecifico {
    id?: number;
    requisito_informacion: number;
    order?: number;
    descripcion?: string;
    comentarios?: string;
}

export class DatoEspecifico {
    public id?: number;
    public requisito_informacion: number;
    public order?: number;
    public descripcion?: string;
    public comentarios?: string;

    constructor(dato_especifico: IDatoEspecifico){
        let {
            id = null,
            order = null,
            descripcion = '',
            comentarios = ''
        } = dato_especifico

        this.id = id;
        this.requisito_informacion = dato_especifico.requisito_informacion;
        this.descripcion = descripcion;
        this.comentarios = comentarios;
    }
}

export interface IRequisitoInformacion extends IRequisito {
    tiempo_vida_max?: number;
    tiempo_vida_max_ud?: string;
    tiempo_vida_med?: number;
    tiempo_vida_med_ud?: string;
    ocurrencias_simultaneas_max?: number;
    ocurrencias_simultaneas_med?: number;
    datos_especificos?: IDatoEspecifico[];
}

export class RequisitoInformacion extends Requisito {
    public tiempo_vida_max?: number;
    public tiempo_vida_max_ud?: string;
    public tiempo_vida_med?: number;
    public tiempo_vida_med_ud?: string;
    public ocurrencias_simultaneas_max?: number;
    public ocurrencias_simultaneas_med?: number;
    public datos_especificos?: IDatoEspecifico[];

    constructor(requisito: IRequisitoInformacion = { tipo_objeto: TIPOS.REQUISITO_INFORMACION, tipo: 'I' } as IRequisitoInformacion) {
        super(requisito);

        let {
            tiempo_vida_max = 0,
            tiempo_vida_max_ud = 'PD',
            tiempo_vida_med = 0,
            tiempo_vida_med_ud = 'PD',
            ocurrencias_simultaneas_max = 0,
            ocurrencias_simultaneas_med = 0,
            datos_especificos = []
        } = requisito;

        this.tiempo_vida_max = tiempo_vida_max;
        this.tiempo_vida_max_ud = tiempo_vida_max_ud;
        this.tiempo_vida_med = tiempo_vida_med;
        this.tiempo_vida_med_ud = tiempo_vida_med_ud;
        this.ocurrencias_simultaneas_max = ocurrencias_simultaneas_max;
        this.ocurrencias_simultaneas_med = ocurrencias_simultaneas_med;
        this.datos_especificos = datos_especificos;
    }
}