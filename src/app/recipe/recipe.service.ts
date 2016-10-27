import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs';

import '../com/config';
import {HOST} from '../com/config';

import {RecipeFilter} from './recipe-filter.component';
import {HelperService} from '../com/helper.service';

// Recipe object
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


	// / Url builders
	build_search_url(): string {
		let f = this.filter; // for simplicity
		return HOST + `/recipe/search?q=${f.keyword}&cuisine=${f.cuisine}&diet=${f.diet}&intolerances=${f.intolerance}&in_ingrd=${f.includedIngredieint}&out_ingrd=${f.excludedIngredieint}`;
	}

	build_rcp_url(id: number): string {
		return HOST + `/recipe/${id}`;
	}

	fetchRecipesIDs(): Observable<number[]> {
		let formatted_url = this.build_search_url();
		return this.http.get(formatted_url)
			.map((r: Response) => r.json() as number[])
			.catch(this.helper.handleError);
	}

	fetchRecipeDetails(id: number): Observable<Recipe> {
		// nope! then we need to send a request to server
		let formatted_url = this.build_rcp_url(id);
		return this.http.get(formatted_url)
			.map((r: Response) => new Recipe(r.json()))
			.catch(this.helper.handleError);
	}
}
