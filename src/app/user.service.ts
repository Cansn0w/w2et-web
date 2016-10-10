import {Injectable} from '@angular/core';

@Injectable()
export class UserService {
	private _loggedIn: boolean = false;
	private _email: string;
	private _token: string;

	constructor(){
		this.reset();
	}

	reset(): void {
		this._token = '';
		this._email = '';
		this._loggedIn = false;
	}

	login(userdata: {}): boolean {
		this._email = userdata['email'];
		this._token = userdata['token'];
		this._loggedIn = true;
		return true;
	}

	logout(): boolean {
		this.reset();
		return true;
	}

	isLoggedIn(): boolean {
		return this._loggedIn;
	}

	getEmail() {
		return this._email;
	}
}
