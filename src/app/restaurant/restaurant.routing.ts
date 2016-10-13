import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RestaurantComponent} from './restaurant.component'

const restaurantRoutes: Routes = [
	{ path: 'restaurant',  component: RestaurantComponent },
];

export const restaurantRouting: ModuleWithProviders = RouterModule.forChild(restaurantRoutes);