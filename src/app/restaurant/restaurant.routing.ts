import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RestaurantComponent} from './restaurant.component'
import { RestauranteHomeComponent } from './restaurant-home.component'
import { RestaurantDetailComponent } from './restaurant-detail.component'
import { RestaurantListComponent } from './restaurant-list.component'

const restaurantRoutes: Routes = [
	{
		path: 'restaurant',
		component: RestaurantComponent,
		children: [
			{ path: '', component: RestauranteHomeComponent },
			{ path: 'list', component: RestaurantListComponent },
			{ path: 'detail/:id', component: RestaurantDetailComponent },
		]
	}
];

export const restaurantRouting: ModuleWithProviders = RouterModule.forChild(restaurantRoutes);