import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router'

import {UserService} from '../user.service'
import {AuthService} from './auth.service'

import {Cookie} from 'ng2-cookies/ng2-cookies'

@Component({
	selector: 'app-login',
	templateUrl: './templates/signin.component.html',
})
export class SigninComponent implements OnInit {

	islogin: boolean = true;
	isRemembered: boolean = false;

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

	remember_user(choice: boolean): void {
		this.isRemembered = choice;
	}

	// COOKIE SET/GET/DELETE
	set_login_cookie(email: string, password: string): void {
		Cookie.set('email', email, 10);
		Cookie.set('password', password, 10);
	}

	delete_cookies(cookie_name?: string): void {
		if (cookie_name)
			Cookie.delete(cookie_name);
		else
			Cookie.deleteAll();
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
				this.delete_cookies();
			})
	}

	submitLogin(loginData: {}): void {
		// submit login credentials to obtain access token
		this.auth.login(loginData)
			.then(response => {
				// set user info & redirect to homepage
				this.loadUserData(response.key, () => {
					// set login cookies if user wishes
					if (this.isRemembered)
						this.set_login_cookie(loginData['email'], loginData['password']);
					this.router.navigate(['']);
				});
			})
			.catch(err => {
				if (err.status == 400) {
					alert('Invalid Credential!'); // todo, highlighting incorrect fields instead?
					// delete local cookies
					this.delete_cookies();
				}
			});
	}

	submitSignup(regData: {}): void {
		// submit signup credentials to obtain access token
		this.auth.signup(regData)
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
		let cookies = Cookie.getAll();
		if ('email' in cookies && 'password' in cookies) {
			this.loginData = {email: cookies['email'],  password: cookies['password']};
			this.submitLogin(this.loginData);
		}
		else {
			this.islogin = window.location.href.endsWith('signup') ? false : true;
			this.loginData = {email: '', password: ''};
			this.regData = {username: '', email: '', password1: '', password2: ''};
		}
	}
}
