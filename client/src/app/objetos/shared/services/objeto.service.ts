import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { AuthHttp } from 'angular2-jwt';

import { fromObjectToURLSearchParams } from '../../../shared/service.utils';
import { IObjeto } from '../models/objeto.model';
import { ITipoBase } from '../tipos';

@Injectable()
export class ObjetoService {
  private objetoUrl = 'api/objetos/';
  private headers: Headers;

  constructor(private authHttp: AuthHttp) { 
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  getObjeto(id: number, options?: Object): Promise<any> {
    const url = `${this.objetoUrl}${id}/`;
    return this.authHttp.get(url, fromObjectToURLSearchParams(options))
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  getElement(id: number, tipoObjeto: string, options?: Object): Promise<any> {
    let url = `api/${tipoObjeto}/${id}/`;

    return this.authHttp.get(url, fromObjectToURLSearchParams(options))
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  // TODO: Eliminar
  listObjetosIndexFromProyecto(proyecto: number, tipoObjeto?: string, options?: Object): Promise<IObjeto[]> {
    let params = Object.assign({ documento__proyecto: proyecto, fields: 'id,nombre,codigo' }, options);
    
    let api_base_url = tipoObjeto ? `api/${tipoObjeto}/` : this.objetoUrl;
    return this.authHttp.get(api_base_url, fromObjectToURLSearchParams(params))
      .toPromise()
      .then(response => response.json() as IObjeto[])
      .catch(this.handleError);
  }

  listObjetosFromProyecto(proyecto: number, options?: Object): Promise<IObjeto[]> {
    let params = Object.assign({ documento__proyecto: proyecto }, options);

    return this.authHttp.get(this.objetoUrl, fromObjectToURLSearchParams(params))
      .toPromise()
      .then(response => response.json() as IObjeto[])
      .catch(this.handleError);
  }

  listTiposBaseDefault(options?: Object): Promise<ITipoBase[]> {
    const url = 'api/tiposbasedefault/';

    return this.authHttp.get(url, fromObjectToURLSearchParams(options))
      .toPromise()
      .then(response => response.json() as ITipoBase[])
      .catch(this.handleError);
  }

  listTiposTrazables(options?: Object): Promise<any[]> {
    const url = 'api/tipostrazables/';

    return this.authHttp.get(url, fromObjectToURLSearchParams(options))
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  uploadImagenForm(id: number, objeto: FormData): Promise<any> {
    const base_url = 'api/imagenes/';
    const url = id ? `${base_url}${id}/` : base_url;
    const method = id ? 'patch' : 'post';
    return this.authHttp[method](url, objeto)
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  createOrUpdateObjeto(objeto: any, tipoObjeto: string): Promise<any> {
    if(objeto.id){
      return this.authHttp
        .put(`api/${tipoObjeto}/${objeto.id}/`, JSON.stringify(objeto), { headers: this.headers })
        .toPromise()
        .then(res => res.json())
        .catch(this.handleError);
    } else {
      return this.authHttp
        .post(`api/${tipoObjeto}/`, JSON.stringify(objeto), { headers: this.headers })
        .toPromise()
        .then(res => res.json())
        .catch(this.handleError);
    }
  }

  deleteObjeto(objeto: number): Promise<IObjeto> {
    let url = `${this.objetoUrl}${objeto}/`;

    return this.authHttp.delete(url)
      .toPromise()
      .then(response => response.json() as IObjeto)
      .catch(this.handleError);
  }

  deleteElement(id: number, tipoObjeto: string): Promise<any> {
    let url = `api/${tipoObjeto}/${id}/`;

    return this.authHttp.delete(url)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  moveUpElement(id: number, tipoObjeto: string): Promise<any> {
    let url = `api/${tipoObjeto}/${id}/mover_arriba/`;

    return this.authHttp.patch(url, { headers: this.headers })
      .toPromise()
      .then(response => response.json() as IObjeto)
      .catch(this.handleError);
  }

  moveDownElement(id: number, tipoObjeto: string): Promise<any> {
    let url = `api/${tipoObjeto}/${id}/mover_abajo/`;

    return this.authHttp.patch(url, { headers: this.headers })
      .toPromise()
      .then(response => response.json() as IObjeto)
      .catch(this.handleError);
  }

  changeSeccion(objeto: number, seccion: number): Promise<IObjeto> {
    const url = `${this.objetoUrl}${objeto}/cambiar_seccion/`;

    return this.authHttp.patch(url, { seccion: seccion }, { headers: this.headers })
      .toPromise()
      .then(response => response.json() as IObjeto)
      .catch(this.handleError);
  }

}
