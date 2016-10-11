import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';

import {Recipe} from './recipe.service';
import {RecipeService} from './recipe.service'
import {RecipeFilter} from './recipe-filter.component'
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";


@Component({
	selector: 'recipe-list',
	templateUrl: './templates/recipe-list.html'
})
export class RecipeListComponent implements OnInit {

	selectedRecipe: Recipe;
	recipes: Recipe[] = [];

	private searchTerms = new Subject<{key: string, value: string}>();
	private searched_ids: Observable<number[]>;

	constructor(private recipeService: RecipeService,
	            private router: Router,
	            private route: ActivatedRoute,) {
	}


	getRecipeFullList(ids: number[]): void {
		for (let id of ids) {
			this.recipeService.fetchRecipeDetails(+id)
				.subscribe(
					recipe => this.recipes.push(recipe),
					error => console.log(error)
				)
		}
		// caching the recipes info
		this.recipeService.saveSearch(this.recipes);
	}

	ngOnInit() {
		// config search stream
		this.searched_ids = this.searchTerms
			.debounceTime(300)     // wait for 0.3s pause in event
			.distinctUntilChanged() // ignore if next search option is the same as previous
			.switchMap(
				(choice) => {
					if (choice) {
						// whenever a new filter is set, re-perform the recipe search event flow
						this.recipes = [];
						this.recipeService.updateFilter(choice.key, choice.value);
						return this.recipeService.fetchRecipesIDs();
					}
					else {
						return Observable.of<number[]>([]);
					}
				}
			)
			.catch(error => {
				console.log(error);
				return Observable.of<number[]>([]);
			});
		// subscribe to the search results (a list of ids whose recipes matches the filter specifications)
		this.searched_ids
			.subscribe(
				ids => this.getRecipeFullList(ids),
				error => console.log(error)
			);

		// update filter by url specification (useful for bookmarking and re-do search)
		this.route.params.forEach((params: Params) => {
			for (let param in params)
				this.recipeService.updateFilter(param, params[param]);
			// kick off a init search
			this.searchTerms.next({key: '', value: ''})
		});
	}

	onFilterOptionSet(choice: any) {
		// todo: in-place url update should be implemented
		this.searchTerms.next(choice);
	}

	// Events
	onSelectRecipe(recipe: Recipe): void {
		this.router.navigate(['/recipe/detail', recipe.spoonacular_id])
	}
}