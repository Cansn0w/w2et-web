import { Component } from '@angular/core';
import { Router } from '@angular/router'
import { FormGroup } from '@angular/forms';

import { QuestionControlService } from '../core/services/question-control.service';
import { QuestionBase, TextboxQuestion } from '../core/classes/form-questions';
import { UserService } from '../core/services/user.service'
import { AuthService } from '../core/services/auth.service'
import { LoginCredential } from '../core/types';

@Component({
	selector: 'login',
	templateUrl: './templates/login.html'
})
export class LoginComponent {

	keepLoggedin: boolean = false;
	loginForm: FormGroup;

	questions: QuestionBase<string>[] = [
		new TextboxQuestion({
			key: 'email',
			label: 'Email',
			type: 'email',
			feedbacks: { required: 'email is required', email: 'please enter a valid email address'},
			constraints: { required: true, email: true }
		}),
		new TextboxQuestion({
			key: 'password',
			label: 'Password',
			type: 'password',
			feedbacks: { required: 'password is required', minlength: 'Your password should be at least 8-character long'},
			constraints: { required: true, minlength: 8 }
		}),
	];

	constructor(private qControlService: QuestionControlService,
	            private user: UserService,
	            private auth: AuthService,
	            private router: Router) {
		this.loginForm = this.qControlService.toFormGroup(this.questions);
	}

	// not DRY, but will do the trick ...
	redirect(): void { this.router.navigate(['/']) }

	keep_login(choice: boolean): void {
		this.keepLoggedin = choice;
	}

	// submit login credentials and obtain access token
	submitLogin = async function (loginData: LoginCredential) {

		let response = await this.auth.login(loginData)
			.catch(error => {
				if (error.status == 403 || error.status == 400) {
					alert('Invalid Credential!');
					AuthService.deleteCookies();
				}
			});

		let ok = await this.user.fetchUserData(response.key);
		if (ok) {
			if (this.keepLoggedin) AuthService.setCookie('token', response.key);
			this.redirect();
		}
	}.bind(this);

	// EVENTS
	facebookLogin = async function(fbresponse: any) {
		if (fbresponse.code == 200) {
			let response = await this.auth.fbSignup(fbresponse.data.accessToken).catch(error => alert(error.toString()));

			let ok = await this.user.fetchUserData(response.key);
			if (ok) {
				if (this.keepLoggedin) AuthService.setCookie('token', response.key);
				this.redirect();
			}
		} else {
			alert(fbresponse.message);
		}
	}.bind(this);
}