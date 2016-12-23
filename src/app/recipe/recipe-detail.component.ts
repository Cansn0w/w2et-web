import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Recipe } from '../core/classes/recipe';
import { RecipeService } from '../core/services/recipe.service';
import { UserService } from '../core/services/user.service';

@Component({
  selector: 'recipe-detail',
  templateUrl: './templates/recipe-detail.html',
})
export class RecipeDetailComponent implements OnInit {

  recipe: Recipe;
  readonly recipesPerRow: number = 4;

  constructor(
    private route: ActivatedRoute,
      private recipeService: RecipeService,
    public user: UserService
  ) { }

  ngOnInit() {
    // Fetch recipe detail every time component initialises.
    this.route.params.forEach((params: Params) => {
      let id = +params['id'];
      this.recipeService.fetchRecipeDetails(id)
        .then(recipe => this.recipe = recipe)
        .catch(console.error);
    });
  }

  icon_yes_no(isYes: boolean) {
    if (isYes)
      return "glyphicon glyphicon-ok-circle";
    else
      return "glyphicon glyphicon-remove-sign";
  }

  idx(rowNum, colNum): number {
    return rowNum * this.recipesPerRow + colNum;
  }

  colWidthClass() {
    return {
      'col-xs-6': this.recipesPerRow === 2,
      'col-xs-4': this.recipesPerRow === 3,
      'col-xs-3': this.recipesPerRow === 4,
    }
  }
}
