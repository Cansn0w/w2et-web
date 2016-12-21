import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';

import { QuestionControlService } from '../core/services/question-control.service';
import { QuestionBase, TextboxQuestion } from '../core/classes/form-questions';
import { UserService } from '../core/services/user.service'
import { AuthService } from '../core/services/auth.service'
import { SignupCredential } from '../core/types';

@Component({
	selector: 'signup',
	templateUrl: './templates/signup.html'
})
export class SignupComponent {

	signupForm: FormGroup;

	questions: QuestionBase<string>[] = [
		new TextboxQuestion({
			key: 'username',
			label: 'Username',
			type: 'text',
			feedbacks: { required: 'username is required'},
			constraints: { required: true }
		}),
		new TextboxQuestion({
			key: 'email',
			label: 'Email',
			type: 'email',
			feedbacks: { required: 'email is required', email: 'please enter a valid email address'},
			constraints: { required: true, email: true }
		}),
		new TextboxQuestion(Object.assign({
			key: 'password1',
			label: 'Password',
			type: 'password',
		}, this.qControlService.passwordVadSpec())),
		new TextboxQuestion(Object.assign({
			key: 'password2',
			label: 'Confirm Pssword',
			type: 'password',
		}, this.qControlService.passwordVadSpec())),
	];

	constructor(private qControlService: QuestionControlService,
	            private user: UserService,
	            private router: Router,
	            private auth: AuthService,) {
		this.signupForm = this.qControlService.toFormGroup(this.questions);
	}

	// not DRY, but will do the trick ...
	redirect(): void { this.router.navigate(['/']) }

	// submit registration credentials to obtain access token
	submitSignup = async function(regData: SignupCredential) {
		// validate password
		if (regData.password1 !== regData.password2) {
			alert('Please make sure your have entered the same password twice o.O ');
			return Promise.reject(null);
		}
		let response = await this.auth.signup(regData).catch(error => alert(error.toString()));

		let ok = await this.user.fetchUserData(response.key).catch(error => alert(error.toString()));
		if (ok) this.redirect();
	}.bind(this);
}