import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { RestaurantFilter } from '../classes/filters';
import { Restaurant } from '../classes/restaurant';
import { Observable } from 'rxjs';
import { HOST } from  '../../shared/vendors';

import '../../shared/vendors'
import * as Collections from 'typescript-collections';
import { UtilService } from '../services/util.service';


// SEARCH HISTORY
type History = { filterUrl: string, result: Restaurant[] };
export class SearchHistory {
	/*
	 * Search history saves the 10 latest search results, using filter url as the query key;
	 * The head element (oldest search result) is popped when the queue is full.
	 */
	// expected type: Queue<{ filterUrl: string, result: Restaurant[] }>

	history_queue = new Collections.Queue();
	max_len: number;

	constructor(max_len?: number) {
		max_len ? this.max_len = max_len: this.max_len = 10;
	}

	set_maxLen(len: number): void {
		this.max_len = len;
	}

	add(searchEvent : History): void {
		if (this.history_queue.size() >= this.max_len)
			this.history_queue.dequeue();

		this.history_queue.enqueue(searchEvent);
	}

	search_history(filterUrl: string): any {
		let result = null;

		this.history_queue.forEach((search) => {
			if (search['filterUrl'] == filterUrl) {
				result = search['result'];
				// short circuit the search loop
				return false;
			}
		});

		return result;
	}

	clear_history(): void {
		this.history_queue.clear();
	}
}

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
	fetchRestaurantDetail(id: number): Observable<Restaurant> {
		let formatted_url = HOST + `/restaurant/${id}`;
		return this.http.get(formatted_url)
			.map((r: Response) => new Restaurant(r.json()))
			.catch(this.helper.handleError);
	}

	fetchRestaurants(): Observable<Restaurant[]> {
		let f = this.filter;
		let formatted_url = HOST + `/restaurant/@${f.lat},${f.lng}?d=1500`;

		return this.http.get(formatted_url)
			.map((restaurants: Response) => restaurants.json().map(r => new Restaurant(r)))
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
		return this.fetchRestaurants()
			.switchMap(res => Promise.resolve(res))
			.toPromise();
	}
}
