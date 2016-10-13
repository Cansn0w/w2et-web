import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs'

import '../com/config'
import {HOST} from '../com/config'

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
		return HOST + `/recipe/search?q=${f.keyword}&cuisine=${f.cuisine}&diet=${f.diet}&intolerances=${f.intolerance}&in_ingrd=${f.includedIngredieint}&out_ingrd=${f.excludedIngredieint}`;
	}

	build_rcp_url(id: number): string {
		return HOST + `/recipe/${id}`;
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

	fetchRecipesIDs(): Observable<number[]> {
		let formatted_url = this.build_search_url();
		return this.http.get(formatted_url)
			.map((r: Response) => r.json() as number[])
			.catch(this.handleError);
	}

	fetchRecipeDetails(id: number): Observable<Recipe> {
		// first see if there is any luck in local cache..
		for (let recipe of this.last_recipes) {
			if (recipe.spoonacular_id == id)
				return Observable.of<Recipe>(recipe);
		}

		// nope! then we need to send a request to server
		let formatted_url = this.build_rcp_url(id);
		return this.http.get(formatted_url)
			.map((r: Response) => r.json() as Recipe)
			.catch(this.handleError);
	}
}
