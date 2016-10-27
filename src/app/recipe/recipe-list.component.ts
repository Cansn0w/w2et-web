import {Component, OnInit} from '@angular/core';
import {trigger, state, style, transition, animate} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';

import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";


import {UserService} from '../com/user.service';
import {Recipe} from './recipe.service';
import {RecipeService} from './recipe.service'
import {HelperService} from '../com/helper.service';

@Component({
	selector: 'recipe-list',
	templateUrl: './templates/recipe-list.html',
	animations: [
		trigger('flyInOut', [
			state('in', style({height: '*'})),
			transition('void => *', [
				style({height: '*'}),
				animate(3000, style({height: 0}))
			])
		])
	]
	// animations: [
	// 	trigger('flyInOut', [
	// 		state('in', style({transform: 'translateX(0)'})),
	// 		transition('void => *', [
	// 			style({transform: 'translateX(-100%)'}),
	// 			animate(1000)
	// 		]),
	// 		transition('* => void', [
	// 			animate(1000, style({transform: 'translateX(100%)'}))
	// 		])
	// 	])
	// ]
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
			// todo: do something to tell user there is no result found
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
			.debounceTime(500)      // trigger interval: 0.5s
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
			let components = this.helper.parseUrlString(params['options']);
			for (let c of components) this.recipeService.updateFilter(c.key, c.value);

			// kick off an init search
			this.searchTerm.next({key: '', value: ''})
		});
	}

	// Events
	onFilterOptionSet(choice: any): void {
		this.searchTerm.next(choice);
	}
}
