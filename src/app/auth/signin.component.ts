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
	submitLogin = async function (loginData: LoginCredential) {
		let response = await this.auth.login(loginData)
			.catch(error => {
				if (error.status == 403 || error.status == 400) {
					alert('Invalid Credential!');
					this.delete_cookies();
				}
			});

		let ok = await this.user.fetchUserData(response.key);
		if (ok) {
			if (this.keepLoggedin) this.set_cookie('token', response.key);
			this.redirect();
		}
	};

	// submit registration credentials to obtain access token
	submitSignup = async function(regData: SignupCredential) {
		// validate password
		if (regData.password1 !== regData.password2) {
			alert('Please make sure your have entered the same password twice o.O ');
			return Promise.reject(null);
		}
		let response = await this.auth.signup(regData).catch(error => alert(error.toString()));

		let ok = await this.user.fetchUserData(response.key);
		if (ok) this.redirect();
	};

	// EVENTS
	facebookLogin = async function(fbresponse: any) {
		if (fbresponse.code == 200) {
			let response = await this.auth.fb_signup(fbresponse.data.accessToken).catch(error => alert(error.toString()));

			let ok = await this.user.fetchUserData(response.key);
			if (ok) {
				if (this.keepLoggedin) this.set_cookie('token', response.key);
				this.redirect();
			}
		} else {
			alert(fbresponse.message);
		}
	};
}
