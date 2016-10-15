import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';

import {Observable} from 'rxjs'
import {HOST} from '../com/config'
import {marker} from './geolocation.service'

import '../com/config'

// Restaurant
export class Restaurant {

	name: string;
	categories: any[];

	id: string;
	url: string;
	image: string;
	lat: number;
	lng: number;
	address: string;

	constructor() {}
}


@Injectable()
export class RestaurantService {

	constructor(private http: Http){
	}

	private handleError(error: any): Promise<any> {
		console.error('Oppps!', error);
		return Promise.reject(error.message || error);
	}


	fetchRestaurantDetail(id: number): Observable<Restaurant> {
		let formatted_url = HOST + `/restaurant/${id}`;
		return this.http.get(formatted_url)
			.map((r: Response) => r.json() as Restaurant)
			.catch(this.handleError);
	}


	fetchRestaurant(loc: any): Observable<Restaurant[]> {
		// url pattern: /restaurant/@LAT,LNG
		let formatted_url = HOST + `/restaurant/@${loc.lat},${loc.lng}`;

		return this.http.get(formatted_url)
			.map((restaurants: Response) => restaurants.json() as Restaurant[])
			.catch(this.handleError);
	}
}