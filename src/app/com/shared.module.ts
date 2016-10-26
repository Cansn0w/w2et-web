import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {FacebookShareButton} from './facebook/fbshare.component';
import {FacebookLoginButton} from './facebook/fblogin.component';

import {ProfileGuard} from './widgets/profile.guard';
import {SessionGuard} from './widgets/session.guard';
import {SafePipe} from './widgets/safe-url.pipe';
import {RangePipe} from './widgets/range.pipe';

import {HelperService} from './helper.service';
import {FacebookService} from 'ng2-facebook-sdk/dist';
import {FacebookInitialiser} from './facebook/fb.initialiser';

@NgModule({
	declarations: [
		FacebookShareButton,
		FacebookLoginButton,
		SafePipe,
		RangePipe,
	],
	exports: [
		CommonModule,
		FormsModule,
		FacebookShareButton,
		FacebookLoginButton,
		SafePipe,
		RangePipe
	],
	providers: [
		ProfileGuard,
		SessionGuard,
		HelperService,
		FacebookService,
		FacebookInitialiser
	]
})

export class SharedModule {}