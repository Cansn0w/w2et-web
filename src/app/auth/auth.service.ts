import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';

import 'rxjs/add/operator/toPromise'

@Injectable()
export class AuthService {

	private host = 'http://10.19.71.137:8000/';

	constructor(private http: Http) {
	}


	private get_endpoint(type: string): string {
		let path = '';
		switch (type) {
			case 'login':
				path = 'auth/login/';
				break;
			case 'signup':
				path = 'auth/registration/';
				break;
			case 'getuser':
				path = 'auth/user/';
				break;
			case 'logout':
				path = 'auth/logout/';
				break;
		}
		return this.host + path;
	}

	// Server communication handlers
	private handleError(error: any): Promise<any> {
		console.error('Oppps!', error);
		return Promise.reject(error.message || error);
	}

	// LOGIN
	login(loginData: {}): Promise<any> {
		let body = JSON.stringify(loginData);
		let options = new RequestOptions({
			headers: new Headers({ 'Content-Type': 'application/json' })
		});

		return this.http.post(this.get_endpoint('login'), body, options)
			.toPromise()
			.then(response => response.json())
			.catch(this.handleError)
	}

	// SIGN-UP
	signup(regData: {}): Promise<any>  {
		let body = JSON.stringify(regData);
		let options = new RequestOptions({
			headers: new Headers({ 'Content-Type': 'application/json' })
		});

		return this.http.post(this.get_endpoint('signup'), body, options)
			.toPromise()
			.then(response => response.json())
			.catch(this.handleError);
	}

	// GET USER DATA
	get_user(token: string): Promise<any> {
		let options = new RequestOptions({
			headers: new Headers({ 'Authorization': 'Token '+ token })
		});

		return this.http.get(this.get_endpoint('getuser'), options)
			.toPromise()
			.then(response => response.json())
			.catch(this.handleError);
	}

	// LOGOUT
	logout(token: string): Promise<any> {
		return this.http.get(this.get_endpoint('logout'))
			.toPromise()
			.then(response => response)
			.catch(this.handleError);
	}

	// THIRD-PARTY SIGNUP - FB
	fb_signup() {

	}
}
