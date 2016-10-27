import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';

import 'rxjs/add/operator/toPromise'

import {HelperService} from '../com/helper.service';
import {HOST} from '../com/config'

@Injectable()
export class AuthService {

	redirectUrl: string = '';

	constructor(private helper: HelperService,
	            private http: Http) {
	}

	private get_endpoint(type: string): string {
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

	// HELPER FUNCTIONS
	private cred_header_opt(token: string): RequestOptions {
		return new RequestOptions({
			headers: new Headers({'Authorization': 'Token ' + token})
		});
	}

	private json_header_opt(): RequestOptions {
		return new RequestOptions({
			headers: new Headers({'Content-Type': 'application/json'})
		});
	}

	// LOGIN
	login(loginData: {}): Promise<any> {
		let body = JSON.stringify(loginData);
		let options = this.json_header_opt();

		return this.http.post(this.get_endpoint('login'), body, options)
			.toPromise()
			.then(response => response.json())
			.catch(error => Promise.reject(error));
	}

	// SIGN-UP
	signup(regData: {}): Promise<any> {
		let body = JSON.stringify(regData);
		let options = this.json_header_opt();

		return this.http.post(this.get_endpoint('signup'), body, options)
			.toPromise()
			.then(response => response.json())
			.catch(this.helper.handleError);
	}

	// LOGOUT
	logout(token: string): Promise<any> {
		let options = this.cred_header_opt(token);
		return this.http.post(this.get_endpoint('logout'), {}, options)
			.toPromise()
			.then(response => response.json())
			.catch(this.helper.handleError);
	}

	// RESTORE
	restore(): void {
		this.redirectUrl = '';
	}

	// THIRD-PARTY SIGNUP - FB
	fb_signup(accessToken: string): Promise<any> {
		let options = this.json_header_opt();
		let body = JSON.stringify({access_token : accessToken});
		return this.http.post(this.get_endpoint('facebooklogin'), body, options)
			.toPromise()
			.then(response => response.json())
			.catch(this.helper.handleError);
	}
}
