import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ProfileComponent} from './profile.component'

import { Recipe } from  '../recipe/recipe.service'
import { RecipeService } from  '../recipe/recipe.service'
import { UserService } from '../user.service';
@Component({
  selector: 'profile-recipe',
  templateUrl: 'profile-recipe.component.html',
 // styleUrls: [ 'profile-recipe.component.css' ]
})
export class ProfileRecipeComponent implements OnInit {
  selectedRecipe: Recipe;
  recipes: Recipe[];

  constructor (
  private router: Router,
  private recipeService: RecipeService,
  private userService: UserService){ }

  favRec(): void {
    this.userService.get_fav_recipe().then(recipes => this.recipes = recipes);   //token 是什么?
  }
  ngOnInit() {
    this.favRec();
  }


}


