import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { UserService } from '../services/user.service';
import { Cookie } from 'ng2-cookies/src/cookie'

/*
 * This guard attribute is to be used for pages that are only
 * accessible for logged-in users, e.g, profile pages.
 */
@Injectable()
export class SessionGuard implements CanActivate {
	constructor(private user: UserService) {
	}

	canActivate(): boolean {
		if (this.user.isLoggedIn()) return true;

		if (Cookie.check('token')) {
			let token = Cookie.get('token');
			this.user.fetchUserData(token)
				.then(ok => {
					if (!ok) Cookie.delete('token');
			}).catch(error => Cookie.delete('token'));
		}
		return true;
	}
}