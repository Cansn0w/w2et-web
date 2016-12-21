import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {FacebookShareButton} from './components/fbshare.component';
import {FacebookLoginButton} from './components/fblogin.component';
import {DynamicQuestionComponent} from './components/dynamic-question.component';

import {SafePipe} from './pipes/safe-url.pipe';
import {RangePipe} from './pipes/range.pipe';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule
	],
	declarations: [
		FacebookShareButton,
		FacebookLoginButton,
		DynamicQuestionComponent,
		SafePipe,
		RangePipe,
	],
	exports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,

		FacebookShareButton,
		FacebookLoginButton,
		DynamicQuestionComponent,
		SafePipe,
		RangePipe
	]
})

export class SharedModule {}