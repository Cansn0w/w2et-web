import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecipeComponent } from './recipe.component'
import { RecipeHomeComponent } from './recipe-home.component'
import { RecipeDetailComponent } from './recipe-detail.component'
import { RecipeListComponent } from './recipe-list.component'

const recipeRoutes: Routes = [
	{
		path: 'recipe',
		component: RecipeComponent,
		children: [
			{ path: '', component: RecipeHomeComponent },
			{ path: 'list', component: RecipeListComponent },
			{ path: 'detail/:id', component: RecipeDetailComponent },
		]
	}
];

export const recipeRouting: ModuleWithProviders = RouterModule.forChild(recipeRoutes);