import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {FacebookShareButton} from './components/fbshare.component';
import {FacebookLoginButton} from './components/fblogin.component';

import {SafePipe} from './pipes/safe-url.pipe';
import {RangePipe} from './pipes/range.pipe';

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
	]
})

export class SharedModule {}