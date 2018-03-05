import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { AuthHttp } from 'angular2-jwt';

import { Documento, IDocumento } from './documento.model';

import { IDRFResponse, fromObjectToURLSearchParams } from '../../shared/service.utils';

@Injectable()
export class DocumentoService {
  private documentoUrl = 'api/documentos/';
  private headers: Headers;

  constructor(private authHttp: AuthHttp) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  listDocumentosIndexFromProyecto(proyecto: number, options?: Object): Promise<IDRFResponse> {
    let params = Object.assign({proyecto: proyecto}, options);

    return this.authHttp.get(this.documentoUrl, fromObjectToURLSearchParams(params))
      .toPromise()
      .then(response => response.json() as IDRFResponse)
      .catch(this.handleError);
  }

  getDocumento(id: number, options?: Object): Promise<Documento> {
    const url = `${this.documentoUrl}${id}/`;
    return this.authHttp.get(url, fromObjectToURLSearchParams(options))
      .toPromise()
      .then(response => response.json() as Documento)
      .catch(this.handleError);
  }

  createDocumento(documento: IDocumento): Promise<Documento> {
    return this.authHttp
      .post(this.documentoUrl, JSON.stringify(documento), { headers: this.headers })
      .toPromise()
      .then(res => res.json() as Documento)
      .catch(this.handleError);
  }

  partialUpdateDocumento(documento: IDocumento): Promise<Documento> {
    const url = `${this.documentoUrl}${documento.id}/`;
    return this.authHttp
      .patch(url, JSON.stringify(documento), { headers: this.headers })
      .toPromise()
      .then(res => res.json() as Documento)
      .catch(this.handleError);
  }

  deleteDocumento(id: number): Promise<void> {
    const url = `${this.documentoUrl}${id}/`;
    return this.authHttp.delete(url)
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }

}
