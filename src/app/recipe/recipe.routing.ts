import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecipeComponent } from './recipe.component'
import { RecipeDetailComponent } from './recipe-detail.component'
import { RecipeListComponent } from './recipe-list.component'

const recipeRoutes: Routes = [
	{ path: 'recipe',  component: RecipeComponent },
	{ path: 'recipe/list',  component: RecipeListComponent },
	{ path: 'recipe/detail/:id', component: RecipeDetailComponent }
];

export const recipeRouting: ModuleWithProviders = RouterModule.forChild(recipeRoutes);