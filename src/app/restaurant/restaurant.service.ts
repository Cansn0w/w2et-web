import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';

import {RestaurantFilter} from './restaurant-filter.component';

import {Observable} from 'rxjs';
import {HOST} from '../com/config';

import '../com/config'
import {HelperService} from '../com/helper.service';

// Restaurant
export class Restaurant {

	name: string;
	categories: any[];

	id: string;
	url: string;
	image: string;
	rating: number;

	lat: number;
	lng: number;
	distance: number;
	address: string;

	bookmarked: boolean;

	constructor(restData? : {}) {
		if (restData)
			for (let key in restData)
				this[key] = restData[key];
	}

	flatterned_categories(): string[] {
		return this.categories.map((c) => c['category']);
	}
}


@Injectable()
export class RestaurantService {

	private filter = new RestaurantFilter();

	constructor(private http: Http,
	            private helper: HelperService) {
	}

	// Restaurant Filter handlers
	resetFilter(): void {
		this.filter = new RestaurantFilter();
	}

	getFilter(): RestaurantFilter {
		return this.filter;
	}

	updateFilter(...args: [string, any][]): void {
		for (let arg of args) {
			if (this.filter.hasOwnProperty(arg[0]))
				this.filter[arg[0]] = arg[1];
		}
	}

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
}
