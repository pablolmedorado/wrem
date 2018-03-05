import { IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { INgxMyDpOptions } from 'ngx-mydatepicker';
import * as TIPOS from './tipos';

export const MULTISELECT_SETTINGS: IMultiSelectSettings = {
    showCheckAll: true,
    showUncheckAll: true,
    displayAllSelectedText: true,
    dynamicTitleMaxItems: 0,
    enableSearch: true,
    buttonClasses: 'btn btn-default btn-block',
    containerClasses: ''
};

export const MULTISELECT_PARTICIPANTES_TEXTS: IMultiSelectTexts = {
    checkAll: 'Seleccionar todos',
    uncheckAll: 'Limpiar seleccionados',
    checked: 'participante seleccionado',
    checkedPlural: 'participantes seleccionados',
    searchPlaceholder: 'Buscar...',
    defaultTitle: 'Ninguno',
    allSelected: 'Todos'
};

export const MULTISELECT_TRAZABLES_TEXTS: IMultiSelectTexts = {
    checkAll: 'Seleccionar todos',
    uncheckAll: 'Limpiar seleccionados',
    checked: 'objeto seleccionado',
    checkedPlural: 'objetos seleccionados',
    searchPlaceholder: 'Buscar...',
    defaultTitle: 'Ninguno',
    allSelected: 'Todos'
};

export const MULTISELECT_ASISTENTES_TEXTS: IMultiSelectTexts = {
    checkAll: 'Seleccionar todos',
    uncheckAll: 'Limpiar seleccionados',
    checked: 'asistente seleccionado',
    checkedPlural: 'asistentes seleccionados',
    searchPlaceholder: 'Buscar...',
    defaultTitle: 'Ninguno',
    allSelected: 'Todos'
};

export const DATEPICKER_OPTIONS: INgxMyDpOptions = {
    dateFormat: 'dd/mm/yyyy'
};