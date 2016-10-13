import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router'

import {Cookie} from 'ng2-cookies/ng2-cookies'
import {UserService} from '../user.service'

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

	constructor(
		private router: Router,
		private user: UserService) {
	}


	ngOnInit() {
		// sign-in for user if the auto-login is set by user
		let cookies = Cookie.getAll();
		if (!this.user.isLoggedIn() && 'email' in cookies && 'password' in cookies)
			this.router.navigate(['/signin']);
	}
}
