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

	getRecipeFullList(ids: number[]): void {
		for (let id of ids) {
			this.recipeService.fetchRecipeDetails(+id)
				.then(recipe => {
					this.recipes.push(recipe);
				});
		}
	}

	getRecipeIDs(callback): void {
		this.recipeService.fetchRecipesIDs()
			.then(ids => {
				callback(ids);
			})
	}

	initRecipeList(): void {
		this.recipes = [];
		this.getRecipeIDs((ids: number[]) => {
			this.getRecipeFullList(ids)
		});
	}

	ngOnInit() {
		this.initRecipeList()
	}

	onFilterOptionSet(choice: any) {
		if (choice.key != 'keyword') { // todo: make it responsive
			this.recipeService.updateFilter(choice.key, choice.value);
			console.log(this.recipeService.getFilter());
			this.initRecipeList();
		}
	}

	// Events
	onSelectRecipe(recipe: Recipe): void {
		alert('You have chosen: ' + recipe.spoonacular_id);
	}
}
