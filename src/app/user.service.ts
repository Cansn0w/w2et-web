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
			case 'getuser':
				path = '/account/user/';
				break;
			case 'changepassword':
				path =  '/account/password/change/';
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
	loadUserData(userdata: {}): void {
		this._email = userdata['email'];
		this._username = userdata['username'];
		this._loggedIn = true;
	}

	isLoggedIn(): boolean {
		return this._loggedIn;
	}

	// SETTERS
	setToken(token: string) { this._token = token; }

	// GETTERS
	getToken() { return this._token; }
	getEmail() { return this._email; }
	getUsername() { return this._username; }
	getFavRecipes() { return this._fav_recipes; }
	getFavRestaurants() { return this._fav_restaurants; }

	// USER PREFERENCES -> FAV OR UNFAV
	fetchFav(term: string): Promise<any[]> {
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
							local.push(term == 'recipes' ? new Recipe(r) : new Restaurant(r));
						});
					return local;
				})
				.catch(this.helper.handleError);
		}
	}

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
			.catch(this.helper.handleError);
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
			.catch(this.helper.handleError);
	}

	// this is a tmp solution ...
	bookmark(object: any) : void {

		if (! this._loggedIn) {
			alert('Please login before setting your favorite recipe');
			return;
		}
		let term = object.constructor.name == Recipe.name ? 'recipe' : 'restaurant';
		let method = object.bookmarked ? this.unfav : this.fav;

		method.call(this, object, (succ) => {
			succ ?
				object.bookmarked = !object.bookmarked :
				alert('Sorry we got a problem and could not edit ' + term + ' favorite for you :( .. ');
		});
	}

	// CHECK IF RECIPE/RESTAURANT IS FAVORED
	hasFavored(object: Recipe | Restaurant): boolean {
		return object.constructor.name == Recipe.name ?
			this.helper.contains(this._fav_recipes, object, 'id') :
			this.helper.contains(this._fav_restaurants, object, 'id')
	}

	// FETCH & UPDATE USER DATA
	fetchUserData(token: string, callback): void {
		this._token = token;

		this.http.get(this.get_endpoint('getuser'), this.request_option())
			.toPromise()
			.then(response => this.loadUserData(response.json()))
			.then(_ => this.fetchFav('recipes'))
			.then(_ => this.fetchFav('restaurants'))
			.then(_ => callback(true))
			.catch(err => {
				this.helper.handleError(err);
				this.reset();
				callback(false);
			})
	}

	updateData(newUserData: {}, callback, partial?: boolean): void {
		let body = JSON.stringify(newUserData);
		let request_method = partial ? this.http.patch : this.http.put;
		request_method(this.get_endpoint('setuserdata'), body, this.request_option())
			.toPromise()
			.then(response => callback(response.status == 200))
			.catch(this.helper.handleError);
	}

	changePassword(pswData: {}, callback): void {
		let body = JSON.stringify(pswData);
		this.http.post(this.get_endpoint('changepassword'), body, this.request_option())
			.toPromise()
			.then(response => callback(response.status == 200))
			.catch(this.helper.handleError);
	}
}
