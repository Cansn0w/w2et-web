import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';

import {RestaurantFilter} from './restaurant-filter.component';

import {Observable} from 'rxjs';
import {HOST} from '../com/config';

import '../com/config'

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

  constructor() {
    this.bookmarked = false;  // todo: fetch from backend;
  }

}


@Injectable()
export class RestaurantService {

	private filter = new RestaurantFilter();

	constructor(private http: Http){
	}

	private handleError(error: any): Promise<any> {
		console.error('Oppps!', error);
		return Promise.reject(error.message || error);
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
			.map((r: Response) => r.json() as Restaurant)
			.catch(this.handleError);
	}


	fetchRestaurants(): Observable<Restaurant[]> {
		// url pattern: /restaurant/@LAT,LNG?DISTANCE=__s
		let f = this.filter;
		let formatted_url = HOST + `/restaurant/@${f.lat},${f.lng}?d=1500`;

		return this.http.get(formatted_url)
			.map((restaurants: Response) => restaurants.json() as Restaurant[])
			.catch(this.handleError);
	}
}
