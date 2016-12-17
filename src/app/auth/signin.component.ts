import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { Cookie } from 'ng2-cookies/ng2-cookies'

import { UserService } from '../core/services/user.service'
import { AuthService } from '../core/services/auth.service'
import { LoginCredential, SignupCredential } from '../core/types';

@Component({
	selector: 'app-login',
	templateUrl: './templates/signin.html',
})
export class SigninComponent implements OnInit {

	islogin: boolean = true;
	keepLoggedin: boolean = false;
	loginData: LoginCredential;
	regData: SignupCredential;

	constructor(private user: UserService,
	            private auth: AuthService,
	            private router: Router) {
	}

	ngOnInit() {
		this.islogin = !window.location.href.endsWith('signup');
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

	// Redirection
	redirect(): void {
		// redirect user to the cached url or homepage, which is the defualt redirect url in auth service
		let url = this.auth.redirectUrl;
		this.router.navigate([url]);

		// restore auth state
		this.auth.restore();
	}

	// submit login credentials and obtain access token
	submitLogin(loginData: LoginCredential): void {
		this.auth.login(loginData)
			.then(response => {
				// set user info, then redirect user
				this.user.fetchUserData(response.key, (succ) => {
					if (this.keepLoggedin) this.set_cookie('token', response.key);
					this.redirect();
				});
			})
			.catch(err => {
				if (err.status == 403 || err.status == 400) {
					alert('Invalid Credential!');
					this.delete_cookies();
				}
			})
	}

	// submit registration credentials to obtain access token
	submitSignup(regData: SignupCredential): void {
		// validate password
		if (regData.password1 !== regData.password2) {
			alert('Please make sure your have entered the same password twice o.O ');
			return;
		}

		// submit signup credentials to obtain access token
		this.auth.signup(regData)
			.then(response => {
				// set user info & redirect to homepage
				this.user.fetchUserData(response.key, (succ) => {
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
				.then(token => this.user.fetchUserData(token, (succ) => {
					if (this.keepLoggedin) this.set_cookie('token', token);
					this.redirect();
				}))
				.catch(error => alert(error.toString()));
		}
		else {
			alert(fbresponse.message);
		}
	}
}
