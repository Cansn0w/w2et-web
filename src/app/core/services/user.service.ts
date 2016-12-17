import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Recipe } from "../classes/recipe";
import { Restaurant } from '../classes/restaurant';
import { HOST } from '../../shared/vendors';

import { UtilService } from './util.service';

export interface AccountData { username?: string, image?: string, email?: string }
export interface PasswordData { oldpassword: string, new_password1: string, new_password2: string }

/*
 * Maintains a local copy of user data and exposes interfaces to modify its states.
 * All requests changing or retrieving user states are sent from to the server
 * All requests must have an authentication header containing user token.
 *
 * Signatures:
 *
 * > updateAccountData(accountData: AccountData, callback):
 * > changePassword(pswData: PasswordData, callback)
 *
 * > fetchFav(term: string): Promise<any[]>
 * > fav(object: any, callback): void
 * > unfav(object: any, callback): void
 * > bookmark(object: any) : void
 * > fetchUserData(token: string, callback): void
 */
@Injectable()
export class UserService {
	private hasLoggedIn: boolean = false;
	private image: string;
	private email: string;
	private token: string;
	private username: string;
	private favRecipes: Recipe[] = [];
	private favRestaurants: Restaurant[] = [];

	constructor(private http: Http,
	            private helper: UtilService) {
		this.reset();
	}

	// build access endpoint
	private getEndpoint(type: string): string {
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

	private requestOption(): RequestOptions {
		return new RequestOptions({
			headers: new Headers({
				'Content-Type': 'application/json',
				'Authorization': 'Token ' + this.token
			})
		});
	}

	isLoggedIn(): boolean {
		return this.hasLoggedIn;
	}

	// SETTERS
	setToken(token: string) { this.token = token; }

	// GETTERS
	getToken() { return this.token; }
	getEmail() { return this.email; }
	getUsername() { return this.username; }
	getImage() { return this.image;  }
	getFavRecipes() { return this.favRecipes; }
	getFavRestaurants() { return this.favRestaurants; }

	reset(): void {
		[this.token, this.email, this.username] = ['', '', ''];
		[this.favRecipes, this.favRestaurants] = [[], []];
		this.hasLoggedIn = false;
	}


	// Initialise user data content.
	// Userdata should be first fetched from server
	loadUserData(userdata: AccountData): void {
		this.email = userdata['email'];
		this.username = userdata['username'];
		this.image = userdata['image'];
		this.hasLoggedIn = true;
	}

	// Add a recipe/restaurant to user's fav list. Called by bookmark()
	fav(object: any, callback): void {
		let term = object.constructor.name == Recipe.name ? 'recipe' : 'restaurant';
		this.http.put(this.getEndpoint('setfavorite' + term) + object.id, {}, this.requestOption())
			.toPromise()
			.then(response => {
				let succ = false;

				if (response.status == 204) {
					// reset local copy of user's favorite term.
					if (term == 'recipe') this.favRecipes.push(object);
					if (term == 'restaurant') this.favRestaurants.push(object);
					succ = true;
				}

				callback(succ);
			})
			.catch(this.helper.handleError);
	}
	// Remove a recipe/restaurant from user's fav list. Called by bookmark()
	unfav(object: any, callback): void {
		let term = object.constructor.name == Recipe.name ? 'recipe' : 'restaurant';
		this.http.delete(this.getEndpoint('setfavorite' + term) + object.id, this.requestOption())
			.toPromise()
			.then(response => {
				let succ = false;

				if (response.status == 204) {
					// reset local copy of user's favorite term.
					if (term == 'recipe') this.favRecipes = this.helper.removeItem(this.favRecipes, object);
					if (term == 'restaurant') this.favRestaurants = this.helper.removeItem(this.favRestaurants, object);
					succ = true;
				}

				callback(succ);
			})
			.catch(this.helper.handleError);
	}

	fetchUserData(token: string, callback): void {
		this.token = token;

		this.http.get(this.getEndpoint('getuser'), this.requestOption())
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

	/*
	 * Term: expected to be 'recipes' or 'restaurants'
	 * Fetches a list of user favorite recipes/restaurants from server and set
	 * the 'bookmarked' field as true.
	 */
	fetchFav(term: string): Promise<any[]> {
		let local: any[] = term == 'recipes' ? this.favRecipes : this.favRestaurants;
		if (local.length != 0) {
			return Promise.resolve(local);
		}
		else {
			return this.http.get(this.getEndpoint('favorite' + term), this.requestOption())
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

	// Fav/unfav a recipe or restaurant
	bookmark(object: any) : void {

		if (! this.hasLoggedIn) {
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

	// Check if a recipe/restaurant has been favoured by user
	hasFavored(object: Recipe | Restaurant): boolean {
		return object.constructor.name == Recipe.name ?
			this.helper.contains(this.favRecipes, object, 'id') :
			this.helper.contains(this.favRestaurants, object, 'id')
	}

	updateAccountData(accountData: AccountData, callback): void {
		let body = JSON.stringify(accountData);

		this.http.put(this.getEndpoint('setuserdata'), body, this.requestOption())
			.toPromise()
			.then(response => callback(response.status == 200))
			.catch(this.helper.handleError);
	}

	changePassword(pswData: PasswordData, callback): void {
		let body = JSON.stringify(pswData);
		this.http.post(this.getEndpoint('changepassword'), body, this.requestOption())
			.toPromise()
			.then(response => callback(response.status == 200))
			.catch(this.helper.handleError);
	}
}