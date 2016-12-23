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

  constructor(
    private http: Http,
    private helper: UtilService
  ) {
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
  setUserData(userdata: AccountData): void {
    this.email = userdata['email'];
    this.username = userdata['username'];
    this.image = userdata['image'];
    this.hasLoggedIn = true;
  }


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

  // Add a recipe/restaurant to user's fav list. Called by bookmark()
  fav(object: Recipe | Restaurant): Promise<boolean> {
    let term = object.constructor.name == Recipe.name ? 'recipe' : 'restaurant';
    return this.http.put(this.getEndpoint('setfavorite' + term) + object.id, {}, this.requestOption())
      .toPromise()
      .then(response => response.status == 204)
      .then(succ => {
        if (succ) {
          if (term == 'recipe') this.favRecipes.push(<Recipe>object);
          if (term == 'restaurant') this.favRestaurants.push(<Restaurant>object);
        }
        return succ;
      })
      .catch(this.helper.handleError);
  }

  // Remove a recipe/restaurant from user's fav list. Called by bookmark()
  unfav(object: Recipe | Restaurant): Promise<boolean> {
    let term = object.constructor.name == Recipe.name ? 'recipe' : 'restaurant';
    return this.http.delete(this.getEndpoint('setfavorite' + term) + object.id, this.requestOption())
      .toPromise()
      .then(response => response.status == 204)
      .then(succ => {
        if (succ) {
          if (term == 'recipe') this.favRecipes = this.helper.removeItem(this.favRecipes, <Recipe>object);
          if (term == 'restaurant') this.favRestaurants = this.helper.removeItem(this.favRestaurants, <Restaurant>object);
        }
        return succ
      })
      .catch(this.helper.handleError);
  }

  fetchUserData(token: string): Promise<boolean> {
    this.token = token;
    return this.http.get(this.getEndpoint('getuser'), this.requestOption())
      .toPromise()
      .then(response => this.setUserData(response.json()))
      .then(_ => Promise.all([this.fetchFav('recipes'), this.fetchFav('restaurants')]))
      .then(_ => true) // user data is successfully loaded
      .catch(err => {
        this.helper.handleError(err);
        this.reset();
      })
  }

  /*
   * Term: expected to be 'recipes' or 'restaurants'
   * Fetches a list of user favorite recipes/restaurants from server and set
   * the 'bookmarked' field as true.
   */
  fetchFav(term: 'recipes' | 'restaurants'): Promise<any[]> {
    let local: any[] = term == 'recipes' ? this.favRecipes : this.favRestaurants;
    if (local.length != 0) return Promise.resolve(local);

    return this.http.get(this.getEndpoint('favorite' + term), this.requestOption())
      .toPromise()
      .then(response => {
        // save data of user fav to local copy;
        response.json().map(r => {
            r['bookmarked'] = true;
            local.push(term == 'recipes' ? new Recipe(r) : new Restaurant(r));
          });
        return local;
      })
      .catch(this.helper.handleError);
  }

  // Fav/unfav a recipe or restaurant
  bookmark(object: any) : void {

    if (! this.hasLoggedIn) {
      alert('Please login before setting your favorite recipe');
      return;
    }
    let term = object.constructor.name == Recipe.name ? 'recipe' : 'restaurant';
    let method = object.bookmarked ? this.unfav : this.fav;

    method.call(this, object).then(ok => {
      ok ?
        object.bookmarked = !object.bookmarked :
        alert('Sorry we got a problem and could not edit your favorite ' + term + ' for you :( .. ');
    });
  }

  // Check if a recipe/restaurant has been favoured by user
  hasFavored(object: Recipe | Restaurant): boolean {
    return object.constructor.name == Recipe.name ?
      this.helper.contains(this.favRecipes, object, 'id') :
      this.helper.contains(this.favRestaurants, object, 'id')
  }

  updateAccountData(accountData: AccountData): Promise<boolean> {
    let body = JSON.stringify(accountData);

    return this.http.put(this.getEndpoint('setuserdata'), body, this.requestOption())
      .toPromise()
      .then(response => response.status == 200)
      .catch(this.helper.handleError);
  }

  changePassword(pswData: PasswordData): Promise<boolean> {
    let body = JSON.stringify(pswData);
    return this.http.post(this.getEndpoint('changepassword'), body, this.requestOption())
      .toPromise()
      .then(response => response.status == 200)
      .catch(this.helper.handleError);
  }
}
