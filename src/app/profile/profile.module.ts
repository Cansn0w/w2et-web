import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RecipeModule } from '../recipe/recipe.module'

import { ProfileComponent } from './profile.component';
import { ProfileRecipeComponent } from './profile-recipe.component';
//import { RecipeDetailComponent } from '../recipe/recipe-detail.component';


import { UserService } from '../user.service';
import { RecipeService } from '../recipe/recipe.service';
import { profileRouting } from './profile.routing'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RecipeModule,
    profileRouting
  ],

  declarations: [
   // RecipeDetailComponent,
    ProfileComponent,
    ProfileRecipeComponent


  ],

  providers: [
    RecipeService,
    UserService
  ]
})

export class ProfileModule {}
