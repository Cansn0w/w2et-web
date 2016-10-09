import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router'

import {UserService} from '../user.service'
import {AuthService} from './auth.service'

@Component({
	selector: 'app-login',
	templateUrl: './templates/signin.component.html',
})
export class SigninComponent implements OnInit {

	islogin: boolean = true;

	loginData: {
		email: string,
		password: string,
	};

	regData: {
		username: string,
		email: string,
		password1: string,
		password2: string
	};

	constructor(private user: UserService,
	            private auth: AuthService,
	            private router: Router) {
	}

	loadUserData(token, callback): void {
		this.auth.get_user(token)
			.then(userdata => {
				userdata['token'] = token;
				this.user.login(userdata);
				callback();
			})
			.catch(err => {
				// WHAT COULD BE HAPPENDING???
			})
	}

	submitLogin(): void {
		// submit login credentials to obtain access token
		this.auth.login(this.loginData)
			.then(response => {
				// set user info & redirect to homepage
				this.loadUserData(response.key, () => {
					this.router.navigate(['']);
				});
			})
			.catch(err => {
				if (err.status == 400) {
					alert('Invalid Credential!'); // todo, highlighting incorrect fields instead?
				}
			});
	}

	submitSignup(): void {
		// submit signup credentials to obtain access token
		this.auth.signup(this.regData)
			.then(response => {
				// set user info & redirect to homepage
				this.loadUserData(response.key, () => {
					this.router.navigate(['']);
				});
			})
			.catch(err => {
				// WHAT COULD BE HAPPENING?
			});
	}

	ngOnInit() {
		this.islogin = window.location.href.endsWith('signup') ? false : true;
		this.loginData = {email: '', password: ''};
		this.regData = {username: '', email: '', password1: '', password2: ''};
	}
}
