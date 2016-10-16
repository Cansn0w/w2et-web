import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {ProfileGuard} from './profile.guard';
import {AutoLoginGuard} from './auto.login.guard';

import {FacebookShareButton} from './fbshare.component';
import {SafePipe} from './safe-url.pipe';

@NgModule({
	declarations: [
		FacebookShareButton,
		SafePipe
	],
	exports: [
		CommonModule,
		FormsModule,
		FacebookShareButton,
		SafePipe
	],
	providers: [
		ProfileGuard,
		AutoLoginGuard
	]
})

export class SharedModule {}