import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs';

import '../com/config';
import {HOST} from '../com/config';

import {RecipeFilter} from './recipe-filter.component';
import {HelperService} from '../com/helper.service';

// Recipe data structure
export class Recipe {
	id: any;

	name: string;
	image: string;
	url: string;

	dairyFree: boolean;
	glutenFree: boolean;
	vegetarian: boolean;

	ingredients: any[];
	instructions: string;
	duration: number;

	bookmarked: boolean;

	constructor(rcpData?: {}) {
		if (rcpData)
			for (let key in rcpData)
				this[key] = rcpData[key];
	}
}
/*
 * Recipe Service:
 * Manages the state of recipes filter and send requests to server for recipe data
 *
 * Search recipe workflow:
 * 1. Set filter options
 * 2. Submit search reqeust to sever to obtain a list of recipe IDs
 * 3. For each ID, send a request containing the ID to obtain the details of that recipe.
 */
@Injectable()
export class RecipeService {
	private filter = new RecipeFilter();

	constructor(private http: Http,
	            private helper: HelperService) {
	}

	// Recipe Filter handlers
	resetFilter(): void {
		this.filter = new RecipeFilter();
	}

	validateFilter(): boolean {
		return this.filter.keyword != '';
	}

	getFilter(): RecipeFilter {
		return this.filter;
	}

	updateFilter(k, y): void {
		if (this.filter.hasOwnProperty(k))
			this.filter[k] = y;
	}

	fetchRecipesIDs(): Observable<number[]> {
		let f = this.filter; // for simplicity
		let formatted_url = HOST + `/recipe/search?q=${f.keyword}&cuisine=${f.cuisine}&diet=${f.diet}&intolerances=${f.intolerance}&in_ingrd=&out_ingrd=`;
		return this.http.get(formatted_url)
			.map((r: Response) => r.json() as number[])
			.catch(this.helper.handleError);
	}

	fetchRecipeDetails(id: number): Observable<Recipe> {
		// nope! then we need to send a request to server
		let formatted_url = HOST + `/recipe/${id}`;
		return this.http.get(formatted_url)
			.map((r: Response) => new Recipe(r.json()))
			.catch(this.helper.handleError);
	}
}
