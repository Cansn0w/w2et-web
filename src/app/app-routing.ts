// import {NgModule} from '@angular/core';
import { ModuleWithProviders } from '@angular/core'
import {Routes, RouterModule} from '@angular/router';

import {HomeComponent} from './home/home.component';
import {LoginComponent} from './auth/login.component';
import {SignupComponent} from './auth/signup.component';

import {SessionGuard} from './core/guards/session.guard';

/*
 * See the 'Router Map' section in frontend doc.
 */
const routes: Routes = [
	{
		path: '',
		canActivate: [SessionGuard],
		children: [
			{ path: 'signup', component: SignupComponent },
			{ path: 'login', component: LoginComponent },
			{ path: '', component: HomeComponent },
			{ path: '**', redirectTo: '',  pathMatch: 'full'},
		]
	}
];

export const app_routing: ModuleWithProviders = RouterModule.forRoot(routes);