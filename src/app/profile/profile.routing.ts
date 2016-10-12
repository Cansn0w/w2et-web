import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileComponent } from './profile.component'
import { ProfileRecipeComponent } from './profile-recipe.component'
//import { RecipeDetailComponent } from '../recipe/recipe-detail.component'


const profileRoutes: Routes = [
  { path: 'profile',  component: ProfileComponent },
  { path: 'profile/recipe',  component: ProfileRecipeComponent },
  //{ path: 'profile/restaurent',  component: FavoriteRestaurantComponent },
  //{ path: 'recipe/detail/:id', component: RecipeDetailComponent }
];

export const profileRouting: ModuleWithProviders = RouterModule.forChild(profileRoutes);
