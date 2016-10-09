import {Injectable} from '@angular/core';

@Injectable()
export class UserService {
	private _loggedIn: boolean = false;
	private _email: string;
	private _token: string;

	login(userdata: {}): boolean {
		this._email = userdata['email'];
		this._token = userdata['token'];
		this._loggedIn = true;
		return true;
	}

	isLoggedIn(): boolean {
		return this._loggedIn;
	}

	getEmail() {
		return this._email;
	}

}
