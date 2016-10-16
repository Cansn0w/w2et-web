import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router'

import {UserService} from '../user.service'
import {AuthService} from './auth.service'

import {Cookie} from 'ng2-cookies/ng2-cookies'

@Component({
	selector: 'app-login',
	templateUrl: './templates/signin.html',
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

	// Retrieve user data using token
	loadUserData(token: string, callback): void {
		this.auth.get_user(token)
			.then(userdata => {
				userdata['token'] = token;
				this.user.login(userdata);
				callback();
			})
			.catch(err => {
				alert('Sorry something is very wrong....');
				this.delete_cookies();
			})
	}

	// Redirection
	redirect(): void {
		// redirect user to the cached url or homepage, which is the defualt redirect url in auth service
		let url = this.auth.redirectUrl;
		this.router.navigate([url]);

		// restore auth state
		this.auth.restore();
	}

	// submit login credentials and obtain access token
	submitLogin(loginData: any): void {
		this.auth.login(loginData)
			.then(response => {
				// set user info, then redirect user
				this.loadUserData(response.key, () => {
					// set login cookies if user wishes
					if (this.isRemembered)
						this.set_login_cookie(loginData['email'], loginData['password']);
					this.redirect();
				});
			})
			.catch(err => {
				if (err.status != 200) {
					alert('Invalid Credential!');
					this.delete_cookies();
				}
			})
	}

	// submit registration credentials to obtain access token
	submitSignup(regData: any): void {
		// validate password
		if (regData.password1 !== regData.password2) {
			alert('Please make sure your have entered the same password twice o.O ');
			return;
		}

		// submit signup credentials to obtain access token
		this.auth.signup(regData)
			.then(response => {
				// set user info & redirect to homepage
				this.loadUserData(response.key, () => {
					this.redirect();
				});
			})
			.catch(error => {
				alert(error.toString());
			})
	}

	ngOnInit() {
		/*
		 * There are 3 reasons why user is interacting with the signin component:
		 * 1. User wants to login or sign up:
		 *      - no real redirection (user is always guided to the homepage);
		 *      - no auto signin by cookie;
		 *
		 * 2. User visits some page:
		 *      - redirect to the page to visit;
		 *      - cookie is checked; auto-login if account credential is set in cookies
		 *
		 * 3. User manually type in profile url: redirection needed:
		 *      - redirect to profile page
		 *      - cookie is checked;
		 *          > auto-login if account credential is set in cookies
		 *          > login or signup is needed before viewing user profile
		 */
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
