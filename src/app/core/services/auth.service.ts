import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/toPromise'

import { UtilService } from './util.service';
import { LoginCredential, SignupCredential } from '../types';
import { HOST } from '../../shared/vendors'
import { Cookie } from 'ng2-cookies/src/cookie'

/*
 * Provide APIs to make authentication related requests
 * This service is primarily for applying user access/removing access tokens, and therefore
 * is independent of user's other internal states.
 */
@Injectable()
export class AuthService {

  redirectUrl: string = '';

  constructor(
    private helper: UtilService,
    private http: Http
  ) { }

  // Cookie management
  static setCookie(name: string, val: string, dur?: number): void {
    let duration = dur || 10;
    Cookie.set(name, val, duration /*days from now*/);
  }
  static deleteCookies(cookieName?: string): void {
    if (cookieName)  Cookie.delete(cookieName);
    else Cookie.deleteAll();
  }
  static hasCookie(cookieName: string): boolean { return Cookie.check(cookieName) }
  static getCookie(cookieName: string): string { return Cookie.get(cookieName) }

  // build access endpoint
  private getEndpoint(type: string): string {
    let path = '';
    switch (type) {
      case 'login':
        path = '/account/login/';
        break;
      case 'signup':
        path = '/account/registration/';
        break;
      case 'getuser':
        path = '/account/user/';
        break;
      case 'logout':
        path = '/account/logout/';
        break;
      case 'facebooklogin':
        path = '/account/facebook/'
    }
    return HOST + path;
  }

  private authHeaderOption(token: string): RequestOptions {
    return new RequestOptions({
      headers: new Headers({'Authorization': 'Token ' + token})
    });
  }

  private jsonHeaderOption(): RequestOptions {
    return new RequestOptions({
      headers: new Headers({'Content-Type': 'application/json'})
    });
  }

  private simplePOST(url, body, options={}): Promise<any> {
    return this.http.post(url, body, options)
      .toPromise()
      .then(response => response.json())
      .catch(this.helper.handleError);
  }

  // LOGIN
  login(loginData: LoginCredential): Promise<any> {
    let body = JSON.stringify(loginData);
    let options = this.jsonHeaderOption();

    return this.http.post(this.getEndpoint('login'), body, options)
      .toPromise()
      .then(response => response.json())
      .catch(error => Promise.reject(error))
  }

  // SIGN-UP
  signup(regData: SignupCredential): Promise<any> {
    let body = JSON.stringify(regData);
    let options = this.jsonHeaderOption();
    return this.simplePOST(this.getEndpoint('signup'), body, options);
  }

  // LOGOUT -
  logout(token: string): Promise<any> {
    let options = this.authHeaderOption(token);
    return this.simplePOST(this.getEndpoint('logout'), {}, options);
  }

  // THIRD-PARTY SIGNUP - FB
  fbSignup(accessToken: string): Promise<any> {
    let options = this.jsonHeaderOption();
    let body = JSON.stringify({access_token : accessToken});
    return this.simplePOST(this.getEndpoint('facebooklogin'), body, options);
  }
}
