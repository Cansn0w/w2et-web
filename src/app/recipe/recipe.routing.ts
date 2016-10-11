import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecipeComponent } from './recipe.component'
import { RecipeDetailComponent } from './recipe-detail.component'
import { RecipeListComponent } from './recipe-list.component'

const recipeRoutes: Routes = [
	{ path: 'recipe',  component: RecipeComponent },
	{ path: 'recipe/list',  component: RecipeListComponent },
	{ path: 'recipe/detail/:id', component: RecipeDetailComponent }
	// Let's over-engineering everything!
	// {
	// 	path: 'recipe',
	// 	component: RecipeComponent,
	// 	children: [{
	// 		path: '',
	// 		children: [
	// 			{ path: 'list', component: RecipeListComponent },
	// 			{ path: 'detail/:id', component: RecipeDetailComponent }
	// 		]
	// 	}]
	// }
];

export const recipeRouting: ModuleWithProviders = RouterModule.forChild(recipeRoutes);