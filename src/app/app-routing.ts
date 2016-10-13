// import {NgModule} from '@angular/core';
import { ModuleWithProviders } from '@angular/core'
import {Routes, RouterModule} from '@angular/router';

import {HomeComponent} from './home/home.component';
import {SigninComponent} from './auth/signin.component';

const routes: Routes = [
	{
		path: 'signin',
		component: SigninComponent
	},
	{
		path: 'login',
		component: SigninComponent
	},
	{
		path: 'signup',
		component: SigninComponent
	},
	{
		path: '',
		component: HomeComponent
	},
	{
		path: '**',
		redirectTo: '',
		pathMatch: 'full'
	}
];

export const app_routing: ModuleWithProviders = RouterModule.forRoot(routes);