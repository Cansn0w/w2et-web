import {Injectable} from '@angular/core';
import {Recipe} from "./recipe/recipe.service";

@Injectable()
export class UserService {
	private _loggedIn: boolean = false;
	private _email: string;
	private _token: string;
	private _fav_recipe: Recipe[];
	private _fav_restaurant: number[];


	constructor() {
		this.reset();
	}

	reset(): void {
		this._token = '';
		this._email = '';
		this._loggedIn = false;
	}

	login(userdata: {}): boolean {
		this._email = userdata['email'];
		this._token = userdata['token'];
		this._fav_recipe = userdata['fav_recipe'];
		this._fav_restaurant = userdata['fav_restaurant'];
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

	getEmail() {
		return this._email;
	}

	getFavRec(): Promise<Recipe[]> {

		let rcp = new Recipe();
		rcp.spoonacular_id = 10086;
		rcp.name = 'beef';
		return Promise.resolve([rcp]);
		//return this._fav_recipe;

	}

	getFavRest(): Promise<number[]> {
		return Promise.resolve([10086]);
		//return this._fav_restaurant;
	}
}
