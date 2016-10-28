import { Injectable } from '@angular/core';
import { FacebookService, FacebookInitParams } from 'ng2-facebook-sdk/dist';

import { FACEBOOK_API_KEY } from '../config';

/*
 * lazy-initialisation of facebook services
 */
@Injectable()
export class FacebookInitialiser {

	constructor(private fb: FacebookService) {
		let fbParams: FacebookInitParams = {
			appId: FACEBOOK_API_KEY,
			xfbml: false,
			cookie: true,
			version: 'v2.6'
		};
		this.fb.init(fbParams);
	}
}