import { URLSearchParams } from '@angular/http';

export interface IDRFResponse {
    count: number;
    next: string;
    previous: null;
    results: any[];
}

export function fromObjectToURLSearchParams(params: Object): {search: URLSearchParams} {
    let params_aux: URLSearchParams = new URLSearchParams();
    for (let param in params) {
        if (params.hasOwnProperty(param)) {
            params_aux.set(param, params[param].toString());
        }
    }
    return {search: params_aux};
}
