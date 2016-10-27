import {Component, OnInit, HostListener} from '@angular/core';
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
	host: {'(scroll)':'onScroll($event)'}
})
export class RecipeListComponent implements OnInit {

	recipes: Recipe[] = [];

	// vars to keep the track of recipes shown
	ids: number[] = [];
	num_shown: number = 0;
	batch_size: number =  5;

	// states
	loading: boolean = true;

	private searchTerm = new Subject<{key: string, value: string}>();
	private searched_ids: Observable<number[]>;


	constructor(public user: UserService,
	            private helper: HelperService,
	            private recipeService: RecipeService,
	            private route: ActivatedRoute,) {
	}

	reset(): void {
		this.recipes= [];
		this.ids = [];
		this.num_shown = 0;
		this.batch_size =  5;
	}

	getRecipeList(ids: number[]): void {
		let start = this.num_shown;
		let end = start + this.batch_size > this.ids.length? this.ids.length : start + this.batch_size;
		this.loading = true;
		for (let id of ids.slice(start, end)) {
			this.recipeService.fetchRecipeDetails(+id)
				.subscribe(
					recipe => {
						if (ids.indexOf(id) + 1 == end) this.loading = false;
						if (this.user.hasFavored(recipe)) recipe.bookmarked = true;
						this.recipes.push(recipe);
					},
					error => console.log(error)
				)
		}
		this.num_shown += this.batch_size;
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
				ids => {
					this.reset();
					this.ids = ids;
					this.getRecipeList(ids);
				},
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
	@HostListener('window:scroll', ['$event'])
	onScroll(_): void {
		// don't sent new request until the previous list has been loaded
		if (this.loading) return;
		// ask for more recipes when user scrolls to the screen bottom.
		if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight)
			this.getRecipeList(this.ids);
	}

	onFilterOptionSet(choice: any): void {
		this.searchTerm.next(choice);
	}
}
