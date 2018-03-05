import { Injectable } from '@angular/core';

import { Http, Headers } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class SignUpService {
  private usuariosUrl = 'api/usuarios/';
  private headers: Headers;

  constructor(private http: Http) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  createUsuario(usuario: any): Promise<any> {
    return this.http
      .post(this.usuariosUrl, JSON.stringify(usuario), { headers: this.headers })
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

}
