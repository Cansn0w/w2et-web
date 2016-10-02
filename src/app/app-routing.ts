// import {NgModule} from '@angular/core';
import { ModuleWithProviders } from '@angular/core'
import {Routes, RouterModule} from '@angular/router';

import {HomeComponent} from './home/home.component';
import {RestaurantComponent} from './restaurant/restaurant.component';
import {LoginComponent} from './login/login.component';
import {ProfileComponent} from './profile/profile.component';

const routes: Routes = [
	{
		path: 'restaurant',
		component: RestaurantComponent
	},
	{
		path: 'login',
		component: LoginComponent
	},
	{
		path: 'profile',
		component: ProfileComponent
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