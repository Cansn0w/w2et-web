import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import 'rxjs/add/operator/toPromise'

import {RecipeFilter} from './recipe-filter.component'

// Recipe object
export class Recipe {
	spoonacular_id: any;

	name: string;
	image: string;
	url: string;

	dairyFree: boolean;
	glutenFree: boolean;
	vegetarian: boolean;

	ingredients: any[];
	instructions: string;

	constructor() {
	}
}

@Injectable()
export class RecipeService {

	// a one-step local cache of recipe search results
	public last_recipes: Recipe[] = [];
	public last_filter: RecipeFilter = new RecipeFilter();

	private filter = new RecipeFilter();
	private host = 'http://192.168.0.200:8000';

	constructor(private http: Http) {
	}

	saveSearch(recipes: Recipe[]): void {
		if (this.last_filter != this.filter) {
			this.last_recipes = recipes;
			this.last_filter = this.filter;
		}
	}

	// Url builders
	build_search_url(): string {
		let f = this.filter; // for simplicity
		return this.host + `/api/recipe/search?q=${f.keyword}&cuisine=${f.cuisine}&diet=${f.diet}&intolerances=${f.intolerance}&in_ingrd=${f.includedIngredieint}&out_ingrd=${f.excludedIngredieint}`;
	}

	build_rcp_url(id: number): string {
		return this.host + `/api/recipe/${id}`;
	}

	// Recipe Filter handlers
	setFilter(filter) {
		this.filter = filter;
	}

	getFilter() {
		return this.filter;
	}

	updateFilter(k, y) {
		if (this.filter.hasOwnProperty(k))
			this.filter[k] = y;
	}

	// Server communication handlers
	private handleError(error: any): Promise<any> {
		console.error('Oppps!', error);
		return Promise.reject(error.message || error);
	}

	fetchRecipesIDs(): Promise<number[]> {
		let formatted_url = this.build_search_url();
		return this.http.get(formatted_url)
			.toPromise()
			.then(response => response.json() as number[])
			.catch(this.handleError)
	}


	fetchRecipeDetails(id: number): Promise<Recipe> {
		// first see if there is any luck in local cache..
		for (let recipe of this.last_recipes) {
			if (recipe.spoonacular_id == id)
				return Promise.resolve(recipe);
		}
		// nope! then we need to send a request to server
		let formatted_url = this.build_rcp_url(id);
		return this.http.get(formatted_url)
			.toPromise()
			.then(response => response.json() as Recipe)
			.catch(this.handleError);
	}
}