import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {RecipeModule} from '../recipe/recipe.module';
import {RestaurantModule} from '../restaurant/restaurant.module';
import {SharedModule} from '../com/shared.module';

import {ProfileComponent} from './profile.component';
import {ProfileRecipeComponent} from './profile-recipe.component';
import {ProfileRestaurantComponent} from './profile-restaurant.component';

import {UserService} from '../user.service';
import {RecipeService} from '../recipe/recipe.service';
import {RestaurantService} from '../restaurant/restaurant.service'
import {profileRouting} from './profile.routing'

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		RecipeModule,
		RestaurantModule,
		SharedModule,
		profileRouting
	],

	declarations: [
		ProfileComponent,
		ProfileRecipeComponent,
		ProfileRestaurantComponent

	],

	providers: [
		RecipeService,
		RestaurantService,
		UserService
	]
})

export class ProfileModule {
}
