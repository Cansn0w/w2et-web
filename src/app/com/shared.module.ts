import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {LoginGuard} from './login.guard';
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
		LoginGuard
	]
})

export class SharedModule {}