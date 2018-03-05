import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { AuthHttp, JwtHelper, tokenNotExpired } from 'angular2-jwt';

interface IUsuarioData {
    id: number;
    email: string;
    full_name: string;
}

@Injectable()
export class AuthenticationService {
    public token: string;
    public user: string;
    public usuario: IUsuarioData;

    private jwtHelper: JwtHelper;
    private refreshSubscription: any;

    private headers = new Headers({ 'Content-Type': 'application/json' });
    private options = new RequestOptions({ headers: this.headers });
    private url = '/api-token-auth/';
    private refresh_url = '/api-token-refresh/';


    constructor(private http: Http, private authHttp: AuthHttp) {
        this.jwtHelper = new JwtHelper();
        // set token if saved in local storage
        this.token = localStorage.getItem('token');
        this.user = localStorage.getItem('user');
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
    }

    public login(email: string, password: string): Promise<boolean> {
        return this.http.post(this.url, JSON.stringify({ email: email, password: password }), this.options)
            .toPromise()
            .then((response: Response) => {
                // login successful if there's a jwt token in the response
                let token = response.json() && response.json().token;
                if (token) {
                    // set token property
                    this.token = response.json().token;
                    this.user = email;
                    this.usuario = response.json().usuario;

                    // store email and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('token', this.token);
                    localStorage.setItem('user', this.user);
                    localStorage.setItem('usuario', JSON.stringify(this.usuario));

                    // Schedule a token refresh
                    this.scheduleRefresh();

                    // return true to indicate successful login
                    return true;
                } else {
                    // return false to indicate failed login
                    return false;
                }
            })
            .catch(error => {
                console.error(error);
                return false;
            });
    }

    public logout(): void {
        // clear token remove user from local storage to log user out
        this.token = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('usuario');
        // Unschedule the token refresh
        this.unscheduleRefresh();
    }

    public loggedIn() {
        return tokenNotExpired('token');
    }

    public scheduleRefresh() {
        // If the user is authenticated, use the token stream
        // provided by angular2-jwt and flatMap the token
        let source = this.authHttp.tokenStream.flatMap(token => {
            // The delay to generate in this case is the difference
            // between the expiry time and the issued at time
            let jwtIat = this.jwtHelper.decodeToken(token).orig_iat;
            let jwtExp = this.jwtHelper.decodeToken(token).exp;
            let iat = new Date(0);
            let exp = new Date(0);

            let delay = (exp.setUTCSeconds(jwtExp) - iat.setUTCSeconds(jwtIat));

            return Observable.interval(delay);
        });

        this.refreshSubscription = source.subscribe(() => {
            this.getNewJwt();
        });
    }

    public startupTokenRefresh() {
        // If the user is authenticated, use the token stream
        // provided by angular2-jwt and flatMap the token
        if (this.loggedIn()) {
            let source = this.authHttp.tokenStream.flatMap(
                token => {
                    // Get the expiry time to generate
                    // a delay in milliseconds
                    let now: number = new Date().valueOf();
                    let jwtExp: number = this.jwtHelper.decodeToken(token).exp;
                    let exp: Date = new Date(0);
                    exp.setUTCSeconds(jwtExp);
                    let delay: number = exp.valueOf() - now;

                    // Use the delay in a timer to
                    // run the refresh at the proper time
                    return Observable.timer(delay);
                });

            // Once the delay time from above is
            // reached, get a new JWT and schedule
            // additional refreshes
            source.subscribe(() => {
                this.getNewJwt();
                this.scheduleRefresh();
            });
        }
    }

    public unscheduleRefresh() {
        // Unsubscribe fromt the refresh
        if (this.refreshSubscription) {
            this.refreshSubscription.unsubscribe();
        }
    }

    public getNewJwt() {
        // Get a new JWT using the token saved in local storage
        this.http.post(this.refresh_url, JSON.stringify({ token: localStorage.getItem('token') }), this.options)
            .toPromise()
            .then((response: Response) => {
                let token = response.json() && response.json().token;
                if (token) {
                    this.token = response.json().token;
                    localStorage.setItem('token', this.token);

                    this.usuario = response.json().usuario;
                    localStorage.setItem('usuario', JSON.stringify(this.usuario));
                }
            });
    }
}
