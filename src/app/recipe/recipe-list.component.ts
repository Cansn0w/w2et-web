import {Component, HostListener, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';

import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {Subscription} from 'rxjs/Subscription';

import {UserService} from '../core/services/user.service';
import {Recipe} from '../core/classes/recipe';
import {RecipeService} from '../core/services/recipe.service'
import {UtilService} from '../core/services/util.service';

@Component({
	selector: 'recipe-list',
	templateUrl: './templates/recipe-list.html',
	host: {'(scroll)':'onScroll($event)'}
})
export class RecipeListComponent implements OnInit, OnDestroy {

	recipes: Recipe[];
	ids: number[] = [];

	// states
	loading: boolean = true;

	private searchTerm = new Subject<{key: string, value: string}>();
	private matchedRecipesIds: Observable<number[]>;
	private subscriptions: Subscription[] = [];


	constructor(public user: UserService,
	            private helper: UtilService,
	            private recipeService: RecipeService,
	            private route: ActivatedRoute,) {
	}

	ngOnDestroy() { this.subscriptions.forEach(s => s.unsubscribe())}
	ngOnInit() {
		// config search stream
		this.matchedRecipesIds = this.searchTerm
			.startWith({key: '', value: ''}) // the init search uses pre-set filter options
			.debounceTime(500)      // trigger interval: 0.5s
			.distinctUntilChanged() // ignore if next search option is the same as previous
			.switchMap(
				(choice) => {
					if (choice) {
						// whenever a new filter is set, re-do the recipe search event flow
						this.recipeService.updateFilter(choice.key, choice.value);
						if (this.recipeService.validateFilter()) return this.recipeService.fetchRecipesIDs();
					}
					return Observable.of<number[]>([]);
				}
			)
			.catch(error => {
				this.helper.handleError(error);
				return Observable.of<number[]>([]);
			});

		// subscribe to the search results (a list of ids whose recipes matches the filter specifications)
		this.subscriptions.push(this.matchedRecipesIds
			.subscribe(
				ids => {
					[this.recipes, this.ids] = [[], ids];
					this.loadRecipes();
				},
				error => console.log(error)
			)
		);

		// update filter by url specification (useful for bookmarking and re-do search)
		this.route.params.forEach((params: Params) => {
			// parse filter url components
			let components = this.helper.parseUrlString(params['options']);
			components.forEach(c => this.recipeService.updateFilter(c.key, c.value));
		});
	}

	loadRecipes(size: number = 5) {
		let start = this.recipes.length;
		this.loading = true;

		for (let id of this.ids.slice(start, start + size)) {
			this.recipeService.fetchRecipeDetails(+id)
				.then(recipe => {
					if (this.ids.indexOf(id) + 1 == start + size) this.loading = false; // fixme: this logic should be taken care of externally
					if (this.user.hasFavored(recipe)) recipe.bookmarked = true;
					this.recipes.push(recipe);
				})
				.catch(console.error);
		}
	}

	loadMoreRecipes(): void {
		if (this.recipes.length < this.ids.length) {
			this.loadRecipes();
		}
	};

	@HostListener('window:scroll', ['$event'])
	onScroll(_): void {
		// don't sent new request until the previous list has been loaded
		if (this.loading) return;
		// ask for more recipes when user scrolls to the screen bottom.
		if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight)
			this.loadMoreRecipes();
	}

	onFilterOptionSet(choice: any): void {
		this.searchTerm.next(choice);
	}
}
