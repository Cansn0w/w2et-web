import {Injectable} from '@angular/core';
import {
	CanActivate, Router,
	ActivatedRouteSnapshot,
	RouterStateSnapshot
} from '@angular/router';

import {UserService} from '../user.service';
import {AuthService} from '../auth/auth.service';
import {Cookie} from 'ng2-cookies/src/cookie'

/*
 * This guard attribute is to be used for pages that are only
 * accessible for logged-in users, e.g, profile pages.
 */
@Injectable()
export class AutoLoginGuard implements CanActivate {
	constructor(
		private user: UserService,
		private auth: AuthService,
		private router: Router) {
	}

	checkSigninCookie(url: string): boolean {
		// let pass the user straightaway if the user has already loggedin
		if (this.user.isLoggedIn()) return true;

		// check if user has set signin cookie, and if does, perform login for user
		if (Cookie.check('email') && Cookie.check('password')) {
			this.auth.redirectUrl = url;
			this.router.navigate(['/login']);
			return false;
		}
		else
			return true;
	}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		let url: string = decodeURIComponent(state.url);
		return this.checkSigninCookie(url);
	}
}