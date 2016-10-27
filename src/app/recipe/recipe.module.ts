import { NgModule } from '@angular/core';
import { DropdownModule } from 'ng2-bootstrap/ng2-bootstrap';

import {SharedModule} from '../com/shared.module';

import { RecipeComponent } from './recipe.component';
import { RecipeFilterComponent } from './recipe-filter.component'
import { RecipeHomeComponent } from './recipe-home.component'
import { RecipeDetailComponent } from './recipe-detail.component';
import { RecipeListComponent } from './recipe-list.component';

import { UserService } from '../com/user.service';
import { RecipeService } from './recipe.service';
import { recipeRouting } from './recipe.routing'

@NgModule({
	imports: [
		SharedModule,
		recipeRouting,
    DropdownModule
	],

	declarations: [
		RecipeComponent,
		RecipeHomeComponent,
		RecipeListComponent,
		RecipeDetailComponent,
		RecipeFilterComponent,
	],

	exports: [
		RecipeComponent,
		RecipeHomeComponent,
		RecipeListComponent,
		RecipeDetailComponent,
		RecipeFilterComponent,
	],

	providers: [
		RecipeService,
		UserService
	]
})

export class RecipeModule {}
