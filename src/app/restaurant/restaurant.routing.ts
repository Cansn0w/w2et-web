import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RestaurantComponent} from './restaurant.component'
import { RestauranteHomeComponent } from './restaurant-home.component'
import { RestaurantDetailComponent } from './restaurant-detail.component'
import { RestaurantListComponent } from './restaurant-list.component'

import {SessionGuard} from '../com/widgets/session.guard';

const restaurantRoutes: Routes = [
	{
		path: 'restaurant',
		component: RestaurantComponent,
		canActivate: [SessionGuard],
		children: [
			{ path: '', component: RestauranteHomeComponent },
			{ path: 'list/:options', component: RestaurantListComponent },
			{ path: 'detail/:id', component: RestaurantDetailComponent },
		]
	}
];

export const restaurantRouting: ModuleWithProviders = RouterModule.forChild(restaurantRoutes);