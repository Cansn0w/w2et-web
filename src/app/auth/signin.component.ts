import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router'
import {Cookie} from 'ng2-cookies/ng2-cookies'

import {UserService} from '../user.service'
import {AuthService} from './auth.service'


@Component({
	selector: 'app-login',
	templateUrl: './templates/signin.html',
})
export class SigninComponent implements OnInit {

	islogin: boolean = true;
	keepLoggedin: boolean = false;

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

	ngOnInit() {
		this.islogin = window.location.href.endsWith('signup') ? false : true;
		this.loginData = {email: '', password: ''};
		this.regData = {username: '', email: '', password1: '', password2: ''};
	}

	keep_login(choice: boolean): void {
		this.keepLoggedin = choice;
	}

	// COOKIE SET/GET/DELETE
	set_cookie(name: string, val: string, dur?: number): void {
		let duration = dur ? dur: 10;
		Cookie.set(name, val, duration);
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
			// Get username,
			.then(userData => {
				userData['token'] = token;
				this.user.login(userData);
			})
			.then(_ => this.user.get_fav('recipes'))
			.then(_ => this.user.get_fav('restaurants'))
			.then(_ => callback())
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
					// set session cookies if user wishes
					if (this.keepLoggedin) this.set_cookie('token', response.key);
					this.redirect();
				});
			})
			.catch(err => {
				if (err.status == 403) {
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
			.catch(error => alert(error.toString()))
	}

	// EVENTS
	facebookLogin(fbresponse: any): void {
		if (fbresponse.code == 200) {
			this.auth.fb_signup(fbresponse.data.accessToken)
				.then(response => response.key)
				.then(token => this.loadUserData(token, () => {
					this.redirect();
				}))
				.catch(error => alert(error.toString()));
		}
		else {
			alert(fbresponse.message);
		}
	}
}
