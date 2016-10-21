import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';

import {UserService} from '../../user.service';
import {AuthService} from '../../auth/auth.service';
import {Cookie} from 'ng2-cookies/src/cookie'

/*
 * This guard attribute is to be used for pages that are only
 * accessible for logged-in users, e.g, profile pages.
 */
@Injectable()
export class SessionGuard implements CanActivate {
	constructor(
		private user: UserService,
		private auth: AuthService) {
	}

	canActivate(): boolean {
		if (this.user.isLoggedIn()) return true;

		if (Cookie.check('token')) {
			let token = Cookie.get('token');
			this.auth.get_user(token)
				.then(userData => {
					userData['token'] = token;
					this.user.login(userData);
				})
		}
		return true;
	}
}