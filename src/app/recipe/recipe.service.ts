import {Injectable} from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise'

import { RecipeFilter } from './recipe-filter.component'

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

	constructor() { }
}

@Injectable()
export class RecipeService {

	private rcpt_detail_url = 'http://192.168.0.200:8000/api/rcp/recipe/{0}';

	private headers = new Headers({'Content-Type': 'application/json'});
	private filter = new RecipeFilter();

	constructor(private http: Http) {}

	// Url builders
	build_search_url(): string {
		let f = this.filter; // for simplicity
		return `http://192.168.0.200:8000/api/rcp/search/q=${f.keyword}&cuisine=${f.cuisine}&diet=${f.diet}&intolerances=${f.intolerance}&in_ingrd=${f.includedIngredieint}&out_ingrd=${f.excludedIngredieint}`;
	}

	build_rcp_url(id: number): string {
		return `http://192.168.0.200:8000/api/rcp/recipe/${id}`;
	}

	// Recipe Filter handlers
	setFilter(filter) {
		this.filter = filter;
	}
	getFilter() {
		return this.filter;
	}
	updateFilter(k, y){
		if (this.filter.hasOwnProperty(k))
			this.filter[k] = y;
	}

	// Server communication handlers
	private handleError(error: any): Promise<any> {
		console.error('Oppps!', error);
		return Promise.reject(error.message || error);
	}

	private parseRecipe(data) {
		let recipes = [];
		for (let recipe of data) {
			recipes.push(recipe)
		}
		return recipes;
	}

	searchRecipes(): Promise<Recipe[]> {
		let formatted_url = this.build_search_url();
		console.log('recipe-service');
		console.log(formatted_url);

		return this.http.get(formatted_url)
			.toPromise()
			.then(response =>
				this.parseRecipe(response.json()) as Recipe[]
			)
			.catch(this.handleError);
	}

	fetchRecipeDetails(id: number): Promise<Recipe> {
		let formatted_url = this.build_rcp_url(id);
		return this.http.get(formatted_url)
			.toPromise()
			.then(response => response.json().data as Recipe)
			.catch(this.handleError);
	}
}