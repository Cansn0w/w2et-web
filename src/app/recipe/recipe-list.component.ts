import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Recipe } from './recipe.service';
import { RecipeService } from './recipe.service';
import { RecipeFilter } from './recipe-filter.component';


@Component({
	selector: 'recipe-list',
	templateUrl: './templates/recipe-list.html'
})
export class RecipeListComponent implements OnInit {

	recipes: Recipe[];
	selectedRecipe: Recipe;

	constructor(
		private recipeService: RecipeService,
		private router: Router
	) { }

	getRecipeList(): void {
		this.recipeService.searchRecipes()
			.then(recipes => {
				this.recipes = recipes;
			});
	}

	ngOnInit() {
		this.getRecipeList();
	}

	onFilterOptionSet(choice: any) {
		if (choice.key != 'keyword') { // todo: make it responsive
			this.recipeService.updateFilter(choice.key, choice.value);
			this.getRecipeList();
		}
	}

	// Events
	onSelectRecipe(recipe: Recipe): void {
		alert('You have chosen: ' + recipe.spoonacular_id);
	}
}
