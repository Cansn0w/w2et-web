import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';

import {Recipe} from './recipe.service';
import {RecipeService} from './recipe.service';


@Component({
	selector: 'recipe-list',
	templateUrl: './templates/recipe-list.html'
})
export class RecipeListComponent implements OnInit {

	selectedRecipe: Recipe;
	recipes: Recipe[] = [];

	constructor(private recipeService: RecipeService,
	            private router: Router,
	            private route: ActivatedRoute,) {
	}

	getRecipeFullList(ids: number[]): void {
		for (let id of ids) {
			this.recipeService.fetchRecipeDetails(+id)
				.then(recipe => {
					this.recipes.push(recipe);
				});
		}
		// caching the recipes info
		this.recipeService.saveSearch(this.recipes);
	}

	getRecipeIDs(callback): void {
		this.recipeService.fetchRecipesIDs()
			.then(ids => {
				callback(ids);
			})
	}

	initRecipeList(): void {
		this.getRecipeIDs((ids: number[]) => {
			this.getRecipeFullList(ids);
		});
	}

	ngOnInit() {
		// update filter by url specification (useful for bookmarking and re-do search)
		this.route.params.forEach((params: Params) => {
			for (let param in params)
				this.recipeService.updateFilter(param, params[param]);
			this.initRecipeList();
		});
	}

	onFilterOptionSet(choice: any) {
		// todo: make keyword search also responsive (redux)
		if (choice.key != 'keyword') {
			this.recipes = [];
			this.recipeService.updateFilter(choice.key, choice.value);
			this.initRecipeList(); // todo: in-place url update should be implemented

		}
	}

	// Events
	onSelectRecipe(recipe: Recipe): void {
		this.router.navigate(['/recipe/detail', recipe.spoonacular_id])
	}
}