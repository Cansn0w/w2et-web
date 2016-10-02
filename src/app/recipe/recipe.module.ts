import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RecipeComponent } from './recipe.component';
import { RecipeDetailComponent } from './recipe-detail.component';
import { RecipeListComponent } from './recipe-list.component';
import { RecipeFilterComponent } from './recipe-filter.component'

import { UserService } from '../user.service';
import { RecipeService } from './recipe.service';
import { recipeRouting } from './recipe.routing'

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		recipeRouting
	],

	declarations: [
		RecipeComponent,
		RecipeListComponent,
		RecipeDetailComponent,
		RecipeFilterComponent
	],

	providers: [
		RecipeService,
		UserService
	]
})

export class RecipeModule {}