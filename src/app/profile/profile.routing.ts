import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileComponent } from './profile.component';
import { ProfileRecipeComponent } from './profile-recipe.component';
import { ProfileRestaurantComponent } from './profile-restaurant.component';

import { ProfileGuard } from '../com/profile.guard';
// import { AutoLoginGuard } from '../com/auto.login.guard';

const profileRoutes: Routes = [
	{
		path: 'profile',
		canActivate: [ProfileGuard],
		children: [{
			path:'',
			component: ProfileComponent,
			children: [
				{ path: 'fav/recipe', component: ProfileRecipeComponent },
				{ path: 'fav/restaurant', component: ProfileRestaurantComponent },
				{ path: '', component: ProfileRecipeComponent },
			]
		}]
	}
];

export const profileRouting: ModuleWithProviders = RouterModule.forChild(profileRoutes);
