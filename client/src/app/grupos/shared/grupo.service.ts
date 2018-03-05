import { Injectable } from '@angular/core';

import { Headers } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { AuthHttp } from 'angular2-jwt';

import { Grupo, IGrupo } from './grupo.model';

import { IDRFResponse, fromObjectToURLSearchParams } from '../../shared/service.utils';

@Injectable()
export class GrupoService {
  private grupoUrl = 'api/grupos/';
  private headers: Headers;

  constructor(private authHttp: AuthHttp) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  listGruposIndex(options?: Object): Promise<IDRFResponse> {
    return this.authHttp.get(this.grupoUrl, fromObjectToURLSearchParams(options))
      .toPromise()
      .then(response => response.json() as IDRFResponse)
      .catch(this.handleError);
  }

  listGrupos(options?: Object): Promise<IGrupo[]> {
    return this.authHttp.get(this.grupoUrl, fromObjectToURLSearchParams(options))
      .toPromise()
      .then(response => response.json() as IGrupo[])
      .catch(this.handleError);
  }

  listUsuariosSelect(options?: Object): Promise<{id: number, full_name: string}[]> {
    const url = 'api/selectusuarios/';
    return this.authHttp.get(url, fromObjectToURLSearchParams(options))
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  getGrupo(id: number, options?: Object): Promise<Grupo> {
    const url = `${this.grupoUrl}${id}/`;
    
    return this.authHttp.get(url, fromObjectToURLSearchParams(options))
      .toPromise()
      .then(response => response.json() as Grupo)
      .catch(this.handleError);
  }

  createGrupo(grupo: IGrupo): Promise<Grupo> {
    return this.authHttp
      .post(this.grupoUrl, JSON.stringify(grupo), { headers: this.headers })
      .toPromise()
      .then(res => res.json() as Grupo)
      .catch(this.handleError);
  }

  partialUpdateGrupo(grupo: IGrupo): Promise<Grupo> {
    const url = `${this.grupoUrl}${grupo.id}/`;
    return this.authHttp
      .patch(url, JSON.stringify(grupo), { headers: this.headers })
      .toPromise()
      .then(res => res.json() as Grupo)
      .catch(this.handleError);
  }

  deleteGrupo(id: number): Promise<void> {
    const url = `${this.grupoUrl}${id}/`;
    return this.authHttp.delete(url)
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }

}
