import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { RestaurantFilter } from '../classes/filters';
import { Restaurant } from '../classes/restaurant';
import { SearchHistory } from '../classes/search-history';
import { Observable } from 'rxjs';
import { HOST } from  '../../shared/vendors';

import '../../shared/vendors'
import { UtilService } from '../services/util.service';


@Injectable()
export class RestaurantService {

	private filter = new RestaurantFilter();
	private history = new SearchHistory(5);

	constructor(private http: Http,
	            private helper: UtilService) {
	}

	// History
	saveSearch(filterUrl: string, result): void {
		this.history.add({
			filterUrl: filterUrl,
			result: result
		})
	}

	findSearch(filterUrl: string): Restaurant[] {
		return this.history.search_history(filterUrl);
	}

	getHistory(): SearchHistory {
		return this.history;
	}

	// Restaurant Filter handlers
	resetFilter(): void {
		this.filter = new RestaurantFilter();
	}

	getFilter(): RestaurantFilter {
		return this.filter;
	}

	updateFilter(k, y): void {
		if (this.filter.hasOwnProperty(k))
			this.filter[k] = y;
	}

	// Search & Fetch
	fetchRestaurantDetail(id: number): Promise<Restaurant> {
		let formatted_url = HOST + `/restaurant/${id}`;
		return this.http.get(formatted_url)
			.map((r: Response) => new Restaurant(r.json()))
			.toPromise()
			.catch(this.helper.handleError);
	}

	fetchRestaurants(): Promise<Restaurant[]> {
		let f = this.filter;
		let formatted_url = HOST + `/restaurant/@${f.lat},${f.lng}?d=1500`;

		return this.http.get(formatted_url)
			.map((restaurants: Response) => restaurants.json().map(r => new Restaurant(r)))
			.toPromise()
			.catch(this.helper.handleError);
	}

	// Main utility: search for a list of restaurants given the filter url
	searchRestaurants(url: string): Promise<Restaurant[]> {

		// look up history to try if there is any luck
		let result = this.findSearch(url);
		if (result != null) {
			return Promise.resolve(result);
		}

		// bad luck! then we need to start from parsing filter components and do the actual search
		let components = this.helper.parseUrlString(url);
		for (let c of components) this.updateFilter(c.key, +c.value);
		return this.fetchRestaurants();
	}
}
