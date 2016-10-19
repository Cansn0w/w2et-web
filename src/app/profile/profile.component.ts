import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router'

import {UserService} from '../user.service'

@Component({
	selector: 'app-profile',
	templateUrl: './templates/profile.html',
})
export class ProfileComponent implements OnInit{
	constructor(private user: UserService,
	            private router: Router) {
	}

	ngOnInit() {

	}

	get email() {
		return this.user.getEmail();
	}

	get username() {
		return this.user.getUsername();
	}

}
