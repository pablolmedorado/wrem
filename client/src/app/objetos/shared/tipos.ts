export const PARRAFO: string = 'parraforem';
export const ORGANIZACION: string = 'organizacionrem';
export const PARTICIPANTE: string = 'participanterem';
export const REUNION: string = 'reunionrem';
export const OBJETIVO: string = 'objetivorem';
export const ACTOR: string = 'actorrem';
export const REQUISITO_INFORMACION: string = 'requisitoinformacionrem';
export const DATO_ESPECIFICO: string = 'datoespecificorem';
export const REQUISITO: string = 'requisitorem';
export const CASO_USO: string = 'casodeusorem';
export const PASO_CASO_USO: string = 'pasocurem';
export const EXCEPCION_PASO_CASO_USO: string = 'excepcionpasocurem';
export const TIPO_OBJETOS: string = 'tipoobjetorem';
export const COMPONENTE: string = 'componenterem';
export const ATRIBUTO: string = 'atributorem';
export const TIPO_VALOR: string = 'tipovalorrem';
export const ASOCIACION: string = 'asociacionrem';
export const EXPRESION: string = 'expresionrem';
export const OPERACION_SISTEMA: string = 'operacionsistemarem';
export const ROL: string = 'rolrem';
export const PARAMETRO: string = 'parametrorem';
export const EXCEPCION_OS: string = 'excepcionosrem';
export const CONFLICTO: string = 'conflictorem';
export const DEFECTO: string = 'defectorem';
export const PETICION_CAMBIO: string = 'peticioncambiorem';
export const ALTERNATIVA: string = 'alternativarem';
export const IMAGEN: string = 'imagenrem';
export const SECCION: string = 'seccionrem';
export const MATRIZ_TRAZABILIDAD: string = 'matriztrazabilidadrem';

export const TIPOS_TRAZABLES: string[] = [
    PARRAFO, IMAGEN, OBJETIVO, REQUISITO, REQUISITO_INFORMACION, CASO_USO,
    TIPO_OBJETOS, TIPO_VALOR, ASOCIACION, OPERACION_SISTEMA, CONFLICTO, DEFECTO,
    PETICION_CAMBIO
];

export interface IObjetoTrazable {
    id?: number,
    model?: string,
    label?: string,
    type?: string
}

export interface ITipoBase {
    id: number,
    codigo: string,
    nombre: string,
}

export interface IObjetoConfig {
    is_rem_object: boolean;
    api_reference: string;
    traceable?: boolean;
    related_name?: string;
    icon: any;
    prefix?: any;
    modal_title: any;
}

export const CONFIG: { [clave: string]: IObjetoConfig; } = {
    [PARRAFO]: {
        is_rem_object: true,
        api_reference: 'parrafos',
        traceable: true,
        icon: 'fa-align-left',
        prefix: 'PRG',
        modal_title: 'Párrafo'
    },
    [IMAGEN]: {
        is_rem_object: true,
        api_reference: 'imagenes',
        traceable: true,
        icon: 'fa-picture-o',
        prefix: 'GRF',
        modal_title: 'Imagen'
    },
    [ORGANIZACION]: {
        is_rem_object: true,
        api_reference: 'organizaciones',
        traceable: false,
        icon: 'fa-suitcase',
        prefix: 'ORG',
        modal_title: 'Organización'
    },
    [PARTICIPANTE]: {
        is_rem_object: true,
        api_reference: 'participantes',
        traceable: false,
        icon: 'fa-user',
        prefix: 'STK',
        modal_title: 'Participante'
    },
    [REUNION]: {
        is_rem_object: true,
        api_reference: 'reuniones',
        traceable: false,
        icon: 'fa-users',
        prefix: 'MET',
        modal_title: 'Reunión'
    },
    [OBJETIVO]: {
        is_rem_object: true,
        api_reference: 'objetivos',
        traceable: true,
        icon: 'fa-bullseye',
        prefix: 'OBJ',
        modal_title: 'Objetivo'
    },
    [ACTOR]: {
        is_rem_object: true,
        api_reference: 'actores',
        traceable: false,
        icon: 'fa-child',
        prefix: 'ACT',
        modal_title: 'Actor'
    },
    [REQUISITO]: {
        is_rem_object: true,
        api_reference: 'requisitos',
        traceable: true,
        icon: {
            R: 'fa-check-circle',
            F: 'fa-circle',
            NF: 'fa-circle-o'
        },
        prefix: {
            R: 'CRQ',
            F: 'FRQ',
            NF: 'NFR'
        },
        modal_title: {
            R: 'Requisito de restricción',
            F: 'Requisito funcional',
            NF: 'Requisito no funcional'
        }
    },
    [REQUISITO_INFORMACION]: {
        is_rem_object: true,
        api_reference: 'requisitosinformacion',
        traceable: true,
        icon: 'fa-info-circle',
        prefix: 'IRQ',
        modal_title: 'Requisito de información'
    },
    [CASO_USO]: {
        is_rem_object: true,
        api_reference: 'casosdeuso',
        traceable: true,
        icon: 'fa-comment-o',
        prefix: 'UC',
        modal_title: 'Caso de uso'
    },
    [MATRIZ_TRAZABILIDAD]: {
        is_rem_object: true,
        api_reference: 'matricestrazabilidad',
        traceable: false,
        icon: 'fa-table',
        prefix: 'TRM',
        modal_title: 'Matriz de trazabilidad'
    },
    [TIPO_OBJETOS]: {
        is_rem_object: true,
        api_reference: 'tiposobjeto',
        traceable: true,
        icon: 'fa-window-maximize',
        prefix: 'TYP',
        modal_title: 'Tipo de objetos'
    },
    [TIPO_VALOR]: {
        is_rem_object: true,
        api_reference: 'tiposvalor',
        traceable: true,
        icon: 'fa-calculator',
        prefix: 'VAL',
        modal_title: 'Tipo de valor'
    },
    [ASOCIACION]: {
        is_rem_object: true,
        api_reference: 'asociaciones',
        traceable: true,
        icon: 'fa-window-restore',
        prefix: 'ASO',
        modal_title: 'Asociación'
    },
    [OPERACION_SISTEMA]: {
        is_rem_object: true,
        api_reference: 'operacionessistema',
        traceable: true,
        icon: 'fa-cog',
        prefix: 'SOP',
        modal_title: 'Operación de sistema'
    },
    [CONFLICTO]: {
        is_rem_object: true,
        api_reference: 'conflictos',
        traceable: true,
        icon: 'fa-balance-scale',
        prefix: 'CLF',
        modal_title: 'Conflicto'
    },
    [DEFECTO]: {
        is_rem_object: true,
        api_reference: 'defectos',
        traceable: true,
        icon: 'fa-minus-circle',
        prefix: 'DEF',
        modal_title: 'Defecto'
    },
    [PETICION_CAMBIO]: {
        is_rem_object: true,
        api_reference: 'peticionescambio',
        traceable: true,
        icon: 'fa-recycle',
        prefix: 'CHR',
        modal_title: 'Petición de cambio'
    },
    [SECCION]: {
        is_rem_object: true,
        api_reference: 'secciones',
        traceable: false,
        icon: 'fa-folder',
        prefix: 'SEC',
        modal_title: 'Sección'
    },
    
    [PASO_CASO_USO]: {
        is_rem_object: false,
        api_reference: 'pasoscu',
        related_name: 'pasos',
        icon: 'fa-hashtag',
        modal_title: 'Paso'
    },
    [EXCEPCION_PASO_CASO_USO]: {
        is_rem_object: false,
        api_reference: 'excepcionespasoscu',
        related_name: 'excepciones',
        icon: 'fa-exclamation',
        modal_title: 'Excepción'
    },
    [ATRIBUTO]: {
        is_rem_object: false,
        api_reference: 'atributos',
        related_name: 'atributos',
        icon: 'fa-tag',
        modal_title: 'Atributo'
    },
    [COMPONENTE]: {
        is_rem_object: false,
        api_reference: 'componentes',
        related_name: 'componentes',
        icon: 'fa-puzzle-piece',
        modal_title: 'Componente'
    },
    [EXPRESION]: {
        is_rem_object: false,
        api_reference: 'expresiones',
        related_name: 'expresiones',
        icon: 'fa-superscript',
        modal_title: 'Invariante'
    },
    [ROL]: {
        is_rem_object: false,
        api_reference: 'roles',
        related_name: 'roles',
        icon: 'fa-user-md',
        modal_title: 'Rol'
    },
    [PARAMETRO]: {
        is_rem_object: false,
        api_reference: 'parametros',
        related_name: 'parametros',
        icon: 'fa-tag',
        modal_title: 'Parámetro'
    },
    [EXCEPCION_OS]: {
        is_rem_object: false,
        api_reference: 'excepcionesos',
        related_name: 'excepciones',
        icon: 'fa-exclamation',
        modal_title: 'Excepción'
    },
    [ALTERNATIVA]: {
        is_rem_object: false,
        api_reference: 'alternativas',
        related_name: 'alternativas',
        icon: 'fa-external-link',
        modal_title: 'Alternativa'
    },
    [DATO_ESPECIFICO]: {
        is_rem_object: false,
        api_reference: 'datosespecificos',
        related_name: 'datos_especificos',
        icon: 'fa-info',
        modal_title: 'Dato específico'
    },
};