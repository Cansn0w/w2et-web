import { NgModule } from '@angular/core';

import {SharedModule} from '../com/shared.module';

import { RecipeComponent } from './recipe.component';
import { RecipeFilterComponent } from './recipe-filter.component'
import { RecipeHomeComponent } from './recipe-home.component'
import { RecipeDetailComponent } from './recipe-detail.component';
import { RecipeListComponent } from './recipe-list.component';


import { UserService } from '../user.service';
import { RecipeService } from './recipe.service';
import { recipeRouting } from './recipe.routing'

@NgModule({
	imports: [
		SharedModule,
		recipeRouting
	],

	declarations: [
		RecipeComponent,
		RecipeHomeComponent,
		RecipeListComponent,
		RecipeDetailComponent,
		RecipeFilterComponent,

		// FacebookShareButton,
		// SafePipe
	],

	providers: [
		RecipeService,
		UserService
	]
})

export class RecipeModule {}