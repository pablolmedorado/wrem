export interface ISelectOption {
    value: string|number;
    label: string;
}

export const TIPOS_UNIDADES_TIEMPO: ISelectOption[] = [
    {value:'PD', label:'Por determinar'},
    {value:'A', label:'Año(s)'},
    {value:'M', label:'Mes(es)'},
    {value:'S', label:'Semana(s)'},
    {value:'D', label:'Día(s)'},
    {value:'H', label:'Hora(s)'},
    {value:'MI', label:'Minuto(s)'},
    {value:'SE', label:'Segundo(s)'},
    {value:'DS', label:'Décima(s) de segundo'},
    {value:'CS', label:'Centésima(s) de segundo'},
    {value:'MS', label:'Milisegundo(s)'}
]

export const TIPOS_IMPORTANCIA: ISelectOption[] = [
    {value:'PD', label:'Por determinar'},
    {value:'V', label:'Vital'},
    {value:'I', label:'Importante'},
    {value:'B', label:'Quedaría bien'}
]

export const TIPOS_URGENCIA: ISelectOption[] = [
    {value:'PD', label:'Por determinar'},
    {value:'I', label:'Inmediatamente'},
    {value:'P', label:'Hay presión'},
    {value:'E', label:'Puede esperar'}
]

export const TIPOS_ESTADO_DESARROLLO: ISelectOption[] = [
    {value:'PD', label:'Por determinar'},
    {value:'C', label:'En construcción'},
    {value:'PV', label:'Pendiente de verificación'},
    {value:'PVA', label:'Pendiente de validación'},
    {value:'VA', label:'Validado'}
]

export const TIPOS_ESTABILIDAD: ISelectOption[] = [
    {value:'PD', label:'Por determinar'},
    {value:'B', label:'Baja'},
    {value:'M', label:'Media'},
    {value:'A', label:'Alta'}
]

export const TIPOS_REQUISITO: ISelectOption[] = [
    {value:'R', label:'Restricción'},
    {value:'F', label:'Funcional'},
    {value:'NF', label:'No funcional'}
]

export const TIPOS_ACCIONES_CU: ISelectOption[] = [
    {value:'S', label:'Sistema'},
    {value:'M', label:'Actor'},
    {value:'IE', label:'Inclusión/Extensión'}
]

export const TIPOS_TERMINACION: ISelectOption[] = [
    {value:'PD', label:'Por determinar'},
    {value:'C', label:'Continúa'},
    {value:'SE', label:'Queda sin efecto'}
]

export const TIPOS_ESPECIALIZACION: ISelectOption[] = [
    {value:'D', label:'Subtipos disjuntos'},
    {value:'S', label:'Subtipos solapados'}
]

export const TIPOS_COMPONENTE: ISelectOption[] = [
    {value:'C', label:'Conjunto'},
    {value:'SE', label:'Secuencia'},
    {value:'B', label:'Bolsa'},
    {value:'S', label:'Simple'}
]

export const TIPOS_PROPIEDAD: ISelectOption[] = [
    {value:'C', label:'Constante'},
    {value:'V', label:'Variable'},
    {value:'D', label:'Derivada'}
]

export const TIPOS_EXPRESION: ISelectOption[] = [
    {value:'PRE', label:'Precondición'},
    {value:'POST', label:'Postcondición'}
]

export const TIPOS_ESTADO_CONFLICTO: ISelectOption[] = [
    {value:'PD', label:'Por determinar'},
    {value:'NR', label:'No resuelto'},
    {value:'PN', label:'En proceso de negociación'},
    {value:'R', label:'Resuelto'}
]

export const TIPOS_ESTADO_DEFECTO: ISelectOption[] = [
    {value:'PD', label: 'Por determinar'},
    {value:'NE', label: 'No eliminado'},
    {value:'PN', label: 'En proceso de negociación'},
    {value:'E', label: 'Eliminado'}
]
export const TIPOS_ESTADO_PETICION_CAMBIO: ISelectOption[] = [
    {value:'PD', label: 'Por determinar'},
    {value:'PA', label: 'Pendiente de análisis'},
    {value:'PAR', label: 'Pendiente de aprobar/rechazar'},
    {value:'PR', label: 'Pendiente de realización'},
    {value:'V', label: 'Verificado'},
    {value:'R', label: 'Rechazado'}
]

export const TIPOS_DEFECTO: ISelectOption[] = [
    {value:'PD', label:'Por determinar'},
    {value:'A', label:'Ambigüedad'},
    {value:'NN', label:'No necesidad'},
    {value:'IN', label:'Incomprensibilidad'},
    {value:'NV', label:'No verificabilidad'},
    {value:'IC', label:'Inconsistencia'},
    {value:'NI', label:'No implementabilidad'},
    {value:'VE', label:'Verbosidad excesiva'},
    {value:'DD', label:'Dependiente del diseño'},
    {value:'R', label:'Redundancia'},
    {value:'IM', label:'Imprecisión'},
    {value:'IP', label:'Incompleción'},
    {value:'PNE', label:'Prioridad no establecida'},
    {value:'ENE', label:'Estabilidad no establecida'},
    {value:'NID', label:'Nivel incorrecto de detalle'},
    {value:'NR', label:'No rastreabilidad'},
    {value:'OI', label:'Organizacion incorrecta'},
    {value:'O', label:'Otro'}
]
