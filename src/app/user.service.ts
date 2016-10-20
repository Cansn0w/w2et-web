import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/toPromise';

import {Recipe} from "./recipe/recipe.service";
import {Restaurant} from './restaurant/restaurant.service'
import {HOST} from './com/config';

import {HelperService} from './com/helper.service';

@Injectable()
export class UserService {
	private _loggedIn: boolean = false;
	private _email: string;
	private _token: string;
	private _username: string;
	private _fav_recipes: Recipe[] = [];
	private _fav_restaurants: Restaurant[] = [];

	constructor(private http: Http,
	            private helper: HelperService) {
		this.reset();
	}

	private handleError(error: any): Promise<any> {
		console.error('Oppps!', error);
		return Promise.reject(error.message || error);
	}

	// HELPERS
	private get_endpoint(type: string): string {
		let path = '';
		switch (type) {
			case 'favoriterecipes':
				path = '/account/favourite/recipes/';
				break;
			case 'favoriterestaurants':
				path = '/account/favourite/restaurants/';
				break;
			case 'setfavoriterecipe':
				path = '/recipe/';
				break;
			case 'setfavoriterestaurant':
				path = '/restaurant/';
				break;
			case 'setuserdata':
				path = '/account/profile/';
				break;
		}
		return HOST + path;
	}

	private request_option(): RequestOptions {
		return new RequestOptions({
			headers: new Headers({'Authorization': 'Token ' + this._token})
		});
	}

	reset(): void {
		this._token = '';
		this._email = '';
		this._username = '';
		this._fav_recipes = [];
		this._fav_restaurants = [];
		this._loggedIn = false;
	}

	// LOGIN/LOGOUT
	login(userdata: {}): boolean {
		this._email = userdata['email'];
		this._token = userdata['token'];
		this._username = userdata['username'];
		this._loggedIn = true;
		return true;
	}

	logout(): boolean {
		this.reset();
		return true;
	}

	isLoggedIn(): boolean {
		return this._loggedIn;
	}

	// GETTERS
	getToken() {
		return this._token;
	}

	getEmail() {
		return this._email;
	}

	getUsername() {
		return this._username;
	}

	getFavRecipes() {
		return this._fav_recipes;
	}

	getFavRestaurants() {
		return this._fav_restaurants;
	}


	// GET USER FAV
	get_fav(term: string): Promise<any[]> {
		let local: any[] = term == 'recipes' ? this._fav_recipes : this._fav_restaurants;
		if (local.length != 0) {
			return Promise.resolve(local);
		}
		else {
			return this.http.get(this.get_endpoint('favorite' + term), this.request_option())
				.toPromise()
				.then(response => {
					// save data of user fav to local copy;
					response.json()
						.map(r => {
							r['bookmarked'] = true;
							let newFav = term == 'recipes' ? new Recipe(r) : new Restaurant(r);
							local.push(newFav);
						});
					return local;
				})
				.catch(this.handleError);
		}
	}

	// SET USER FAV RECIPE/RESTAURANT
	fav(object: any, callback): void {

		let term = object.constructor.name == Recipe.name ? 'recipe' : 'restaurant';
		this.http.put(this.get_endpoint('setfavorite' + term) + object.id, {}, this.request_option())
			.toPromise()
			.then(response => {
				let succ = false;

				if (response.status == 204) {
					// reset local copy of user's favorite term.
					if (term == 'recipe') this._fav_recipes.push(object);
					if (term == 'restaurant') this._fav_restaurants.push(object);
					succ = true;
				}

				callback(succ);
			})
			.catch(this.handleError);
	}

	unfav(object: any, callback): void {
		let term = object.constructor.name == Recipe.name ? 'recipe' : 'restaurant';
		this.http.delete(this.get_endpoint('setfavorite' + term) + object.id, this.request_option())
			.toPromise()
			.then(response => {
				let succ = false;

				if (response.status == 204) {
					// reset local copy of user's favorite term.
					if (term == 'recipe') this._fav_recipes = this.helper.removeItem(this._fav_recipes, object);
					if (term == 'restaurant') this._fav_restaurants = this.helper.removeItem(this._fav_restaurants, object);
					succ = true;
				}

				callback(succ);
			})
			.catch(this.handleError);
	}

	// CHECK IF RECIPE/RESTAURANT IS FAVORED
	hasFavored(object: Recipe | Restaurant): boolean {
		return object.constructor.name == Recipe.name ?
			this.helper.contains(this._fav_recipes, object, 'id') :
			this.helper.contains(this._fav_restaurants, object, 'id')
	}

	// UPDATE USER DATA
	updateData(data: {}): void {

	}
}
