import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';

import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";


import {UserService} from '../user.service';
import {Recipe} from './recipe.service';
import {RecipeService} from './recipe.service'
import {HelperService} from '../com/helper.service';

@Component({
	selector: 'recipe-list',
	templateUrl: './templates/recipe-list.html'
})
export class RecipeListComponent implements OnInit {

	recipes: Recipe[] = [];

	private searchTerm = new Subject<{key: string, value: string}>();
	private searched_ids: Observable<number[]>;

	constructor(public user: UserService,
	            private helper: HelperService,
	            private recipeService: RecipeService,
	            private route: ActivatedRoute,) {
	}


	getRecipeFullList(ids: number[]): void {
		if (ids === []) {
			this.notify_empty_result();
			return;
		}

		for (let id of ids) {
			this.recipeService.fetchRecipeDetails(+id)
				.subscribe(
					recipe => {
						if (this.user.hasFavored(recipe)) recipe.bookmarked = true;
						this.recipes.push(recipe);
					},
					error => console.log(error)
				)
		}
		// caching the recipes info
		this.recipeService.saveSearch(this.recipes);
	}

	ngOnInit() {
		// config search stream
		this.searched_ids = this.searchTerm
			.debounceTime(500)      // wait for 0.5s pause in event
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
				this.helper.handleError(error);
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
			// parse filter url components
			let options = params['options'].split(';');

			for (let opt in options) {
				let key = options[opt].split('=')[0];
				let value = options[opt].split('=')[1];
				this.recipeService.updateFilter(key, value);
			}

			// kick off an init search
			this.searchTerm.next({key: '', value: ''})
		});
	}

	// Display to user the result of no recipe found
	notify_empty_result(): void {
		// todo
	}

	// Events
	onFilterOptionSet(choice: any): void {
		// todo: in-place url update should be implemented
		this.searchTerm.next(choice);
	}
}
