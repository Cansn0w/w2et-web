import { Component, OnInit } from '@angular/core';

import { Recipe } from  '../core/classes/recipe'
import { UserService } from '../core/services/user.service';

/**
 * Reuses recipe-list template to display user's favorite recipes
 */
@Component({
  selector: 'profile-recipe',
  templateUrl: '../recipe/templates/recipe-list.html',
})
export class ProfileRecipeComponent implements OnInit {
  // indicator to tell the template not to include the filter component
  atProfile: boolean = true;
  recipes: Recipe[] = [];

  constructor(public user: UserService) {
  }

  ngOnInit() {
    this.getFavRecipes();
  }

  getFavRecipes(): void {
    this.user.fetchFav('recipes').then(recipes => this.recipes = recipes);
  }

  unfavRecipe(recipe: Recipe): void {
    this.user.unfav(recipe).then(ok => ok ? this.getFavRecipes() : alert('Sorry this recipe could not be removed...'));
  }
}


