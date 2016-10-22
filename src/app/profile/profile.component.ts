import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router'
import {Cookie} from 'ng2-cookies/src/cookie';

import {UserService} from '../user.service'


@Component({
	selector: 'app-profile',
	templateUrl: './templates/profile.html',
})
export class ProfileComponent implements OnInit {
	constructor(private user: UserService,
	            private router: Router) {
	}

	ngOnInit() {

	}

	logOut(): void {
		this.user.reset();
		if (Cookie.check('token')) Cookie.delete('token');
	}

	get email() {
		return this.user.getEmail();
	}

	get username() {
		return this.user.getUsername();
	}

}
