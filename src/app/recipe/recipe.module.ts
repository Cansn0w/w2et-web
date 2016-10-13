import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RecipeComponent } from './recipe.component';
import { RecipeFilterComponent } from './recipe-filter.component'
import { RecipeHomeComponent } from './recipe-home.component'
import { RecipeDetailComponent } from './recipe-detail.component';
import { RecipeListComponent } from './recipe-list.component';

import { FacebookShareButton } from '../com/fbshare.component'
import { SafePipe } from '../com/safe-url.pipe'

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
		RecipeHomeComponent,
		RecipeListComponent,
		RecipeDetailComponent,
		RecipeFilterComponent,

		FacebookShareButton,
		SafePipe
	],

	providers: [
		RecipeService,
		UserService
	]
})

export class RecipeModule {}