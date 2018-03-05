import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { AuthHttp } from 'angular2-jwt';

import { Proyecto, IProyecto } from './proyecto.model';

import { IDRFResponse, fromObjectToURLSearchParams } from '../../shared/service.utils';

@Injectable()
export class ProyectoService {
  private proyectoUrl = 'api/proyectos/';
  private headers: Headers;

  constructor(private authHttp: AuthHttp) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  listProyectosIndex(options?: Object): Promise<IDRFResponse> {
    return this.authHttp.get(this.proyectoUrl, fromObjectToURLSearchParams(options))
      .toPromise()
      .then(response => response.json() as IDRFResponse)
      .catch(this.handleError);
  }

  getProyecto(id: number): Promise<Proyecto> {
    const url = `${this.proyectoUrl}${id}/`;
    return this.authHttp.get(url)
      .toPromise()
      .then(response => response.json() as Proyecto)
      .catch(this.handleError);
  }

  createProyecto(proyecto: IProyecto): Promise<Proyecto> {
    return this.authHttp
      .post(this.proyectoUrl, JSON.stringify(proyecto), { headers: this.headers })
      .toPromise()
      .then(res => res.json() as Proyecto)
      .catch(this.handleError);
  }

  partialUpdateProyecto(proyecto: IProyecto): Promise<Proyecto> {
    const url = `${this.proyectoUrl}${proyecto.id}/`;
    return this.authHttp
      .patch(url, JSON.stringify(proyecto), { headers: this.headers })
      .toPromise()
      .then(res => res.json() as Proyecto)
      .catch(this.handleError);
  }

  updateFechaAperturaProyecto(id: number): Promise<Boolean> {
    const url = `${this.proyectoUrl}${id}/actualizar_apertura/`;
    return this.authHttp
      .patch(url, {}, { headers: this.headers })
      .toPromise()
      .then(res => true)
      .catch(this.handleError);
  }

  deleteProyecto(id: number): Promise<void> {
    const url = `${this.proyectoUrl}${id}/`;
    return this.authHttp.delete(url)
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }
}
