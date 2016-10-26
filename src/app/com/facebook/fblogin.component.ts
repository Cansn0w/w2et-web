import {Component, Output, EventEmitter} from '@angular/core';
import {FacebookService, FacebookLoginResponse} from 'ng2-facebook-sdk/dist';
import {FacebookInitialiser} from './fb.initialiser';

import {HelperService} from '../helper.service';

@Component({
	selector: 'facebook-login',
	template: `
		<button type="button" class="btn btn-primary btn-block" style="background-color:#3b5998;"
		        (click)="onFacebookLoginClick()">
		    <svg style="width:24px;height:24px; vertical-align: middle;" viewBox="0 0 24 24">
		        <path fill="#FFF"
		              d="M19,4V7H17A1,1 0 0,0 16,8V10H19V13H16V20H13V13H11V10H13V7.5C13,5.56 14.57,4 16.5,4M20,2H4A2,2 0 0,0 2,4V20A2,2 0 0,0 4,22H20A2,2 0 0,0 22,20V4C22,2.89 21.1,2 20,2Z"/>
		    </svg>
		    Log in with Facebook
		</button>`
})

export class FacebookLoginButton {

	@Output() onFacebookLogin = new EventEmitter<any>();

	constructor(private fb: FacebookService,
	            private fb_init: FacebookInitialiser,
	            private helper: HelperService ) {
	}

	onFacebookLoginClick(): void {
		this.fb.login({scope: 'public_profile,email'}).then(
			(response: FacebookLoginResponse) => {
				if (response.status == 'connected')
					this.onFacebookLogin.emit({code: 200, message: 'Successful', data: response.authResponse});
				else if (response.status == 'not_authorized')
					this.onFacebookLogin.emit({code: 403, message: 'Access denied'});
				else
					this.onFacebookLogin.emit({code: 520, message: 'You may not have been logged into facebook'});
			},
			(error: any) => this.helper.handleError(error)
		);
	}
}