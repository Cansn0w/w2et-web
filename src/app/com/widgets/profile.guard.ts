import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { UserService } from '../user.service'


/*
 * This guard attribute is to be used for pages that are only
 * accessible for logged-in users, i.e , profile pages.
 */
@Injectable()
export class ProfileGuard implements CanActivate {
	constructor(
		private user: UserService,
		private router: Router) {
	}

	canActivate() {
		if (!this.user.isLoggedIn()) {
			this.router.navigate(['/login']);
			return false;
		}
		return true;
	}
}