import { IObjeto, Objeto } from './objeto.model';
import * as TIPOS from '../tipos';

export interface ICasoUso extends IObjeto {
    es_abstracto?: boolean;
    evento_activacion?: string;
    frecuencia?: number;
    frecuencia_ud?: string;
    precondicion?: string;
    postcondicion?: string;
    importancia?: string;
    urgencia?: string;
    estado_desarrollo?: string;
    estabilidad?: string;
    pasos?: IPasoCU[];
}

export class CasoUso extends Objeto {
    public es_abstracto?: boolean;
    public evento_activacion?: string;
    public frecuencia?: number;
    public frecuencia_ud?: string;
    public precondicion?: string;
    public postcondicion?: string;
    public importancia?: string;
    public urgencia?: string;
    public estado_desarrollo?: string;
    public estabilidad?: string;
    public pasos?: IPasoCU[];

    constructor(caso_uso: ICasoUso = { tipo_objeto: TIPOS.CASO_USO } as ICasoUso) {
        super(caso_uso);

        let {
            es_abstracto = false,
            evento_activacion = '',
            frecuencia = 0,
            frecuencia_ud = 'PD',
            precondicion = '',
            postcondicion = '',
            importancia = 'PD',
            urgencia = 'PD',
            estado_desarrollo = 'PD',
            estabilidad = 'PD',
            pasos = []
        } = caso_uso;

        this.es_abstracto = es_abstracto;
        this.evento_activacion = evento_activacion;
        this.frecuencia = frecuencia;
        this.frecuencia_ud = frecuencia_ud;
        this.precondicion = precondicion;
        this.postcondicion = postcondicion;
        this.importancia = importancia;
        this.urgencia = urgencia;
        this.estado_desarrollo = estado_desarrollo;
        this.estabilidad = estabilidad;
        this.pasos = pasos;
    }
}

export interface IPasoCU {
    id?: number;
    caso_uso: number;
    order?: number;
    es_condicional?: boolean;
    condicion?: string;
    tipo_accion?: string;
    actor?: number;
    inclusion_extension?: number;
    acciones_realizadas?: string;
    rendimiento?: number;
    rendimiento_ud?: string;
    comentarios?: string;
    excepciones?: IExcepcionPasoCU[];
}

export class PasoCU {
    public id?: number;
    public descripcion?: string;
    public caso_uso: number;
    public order?: number;
    public es_condicional?: boolean;
    public condicion?: string;
    public tipo_accion?: string;
    public actor?: number;
    public inclusion_extension?: number;
    public acciones_realizadas?: string;
    public rendimiento?: number;
    public rendimiento_ud?: string;
    public comentarios?: string;
    public excepciones?: IExcepcionPasoCU[];

    constructor(pasocu: IPasoCU) {
        let {
            id = null,
            order = null,
            es_condicional = false,
            condicion = '',
            tipo_accion = 'S',
            actor = null,
            inclusion_extension = null,
            acciones_realizadas = '',
            rendimiento = 0,
            rendimiento_ud = 'PD',
            comentarios = '',
            excepciones = []
        } = pasocu;

        this.caso_uso = pasocu.caso_uso;
        this.order = order;
        this.es_condicional = es_condicional;
        this.condicion = condicion;
        this.tipo_accion = tipo_accion;
        this.actor = actor;
        this.inclusion_extension = inclusion_extension;
        this.acciones_realizadas = acciones_realizadas;
        this.rendimiento = rendimiento;
        this.rendimiento_ud = rendimiento_ud;
        this.comentarios = comentarios;
        this.excepciones = excepciones;
    }
}

export interface IExcepcionPasoCU {
    id?: number;
    paso: number;
    order?: number;
    condicion?: string;
    terminacion?: string;
    tipo_accion?: string;
    actor?: number;
    inclusion_extension?: number;
    acciones_realizadas?: string;
    rendimiento?: number;
    rendimiento_ud?: string;
    comentarios?: string;
}

export class ExcepcionPasoCU {
    public id?: number;
    public paso: number;
    public order?: number;
    public condicion?: string;
    public terminacion?: string;
    public tipo_accion?: string;
    public actor?: number;
    public inclusion_extension?: number;
    public acciones_realizadas?: string;
    public rendimiento?: number;
    public rendimiento_ud?: string;
    public comentarios?: string;

    constructor(excepcioncu: IExcepcionPasoCU) {
        let {
            id = null,
            order = null,
            condicion = '',
            terminacion = 'PD',
            tipo_accion = 'S',
            actor = null,
            inclusion_extension = null,
            acciones_realizadas = '',
            rendimiento = 0,
            rendimiento_ud = 'PD',
            comentarios = ''
        } = excepcioncu;

        this.paso = excepcioncu.paso;
        this.order = order;
        this.condicion = condicion;
        this.terminacion = terminacion;
        this.tipo_accion = tipo_accion;
        this.actor = actor;
        this.inclusion_extension = inclusion_extension;
        this.acciones_realizadas = acciones_realizadas;
        this.rendimiento = rendimiento;
        this.rendimiento_ud = rendimiento_ud;
        this.comentarios = comentarios;
    }
}
