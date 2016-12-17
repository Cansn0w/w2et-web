import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecipeComponent } from './recipe.component'
import { RecipeHomeComponent } from './recipe-home.component'
import { RecipeDetailComponent } from './recipe-detail.component'
import { RecipeListComponent } from './recipe-list.component'

import {SessionGuard} from '../core/guards/session.guard';

const recipeRoutes: Routes = [
	{
		path: 'recipe',
		component: RecipeComponent,
		canActivate: [SessionGuard],
		children: [
			{ path: '', component: RecipeHomeComponent },
			{ path: 'list/:options', component: RecipeListComponent },
			{ path: 'detail/:id', component: RecipeDetailComponent },
		]
	}
];

export const recipeRouting: ModuleWithProviders = RouterModule.forChild(recipeRoutes);