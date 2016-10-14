import {Injectable} from '@angular/core';
import {Recipe} from "./recipe/recipe.service";
import {HOST} from './com/config';
import 'rxjs/add/operator/toPromise';

import {Http, Headers, RequestOptions} from '@angular/http';

@Injectable()
export class UserService {
  private _loggedIn: boolean = false;
  private _email: string;
  private _token: string;
  private _fav_recipe : Recipe[];
  private _fav_restaurant: number[];


  constructor(private http: Http){
    this.reset();
  }
  private get_endpoint(type: string): string {
    let path = '';
    switch (type) {
      case 'favoriterecipe':
        path = '/account/favourite/recipes/';
        break;
      case 'favoriterestautant':
        path = '/account/favourite/restaurants/';
        break;
      case 'setfavoriterecipe':
        path = '/recipe/';
        break;
      case 'setfavoriterestautant':
        path = '/restautant/';
        break;
    }
    return HOST + path;
  }

  private handleError(error: any): Promise<any> {
    console.error('Oppps!', error);
    return Promise.reject(error.message || error);
  }


  reset(): void {
    this._token = '';
    this._email = '';
    this._loggedIn = false;
  }

  login(userdata: {}): boolean {
    this._email = userdata['email'];
    this._token = userdata['token'];
    // this._fav_recipe = userdata['fav_recipe'];
    // this._fav_restaurant = userdata['fav_restaurant'];
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
  // getFavRec(): Promise<Recipe[]> {
  //
  //     let rcp = new Recipe();
  //   rcp.spoonacular_id = 10086;
  //   rcp.name = 'beef';
  //   return Promise.resolve([rcp]);
  //   //return this._fav_recipe;
  // }

  get_fav_recipe(): Promise<Recipe[]> {
    let options = new RequestOptions({
      headers: new Headers({'Authorization': 'Token ' + this._token})
    });

    return this.http.get(this.get_endpoint('favoriterecipe'), options)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  set_fav_recipe(id : number, callback): void {
    let options = new RequestOptions({
      headers: new Headers({
        'Authorization': 'Token ' + this._token
      })
    });


    this.http.put(this.get_endpoint('setfavoriterecipe') + id, options)
      .toPromise()
      .then(response => (response) => {
        console.log(response);
        if (response.status == 204) {
          callback(true);
        } else {
          callback(false);
        }
      })
      .catch(this.handleError);
  }


  get_fav_restaurant(token: string): Promise<any> {
    let options = new RequestOptions({
      headers: new Headers({'Authorization': 'Token ' + this._token})
    });

    return this.http.get(this.get_endpoint('favoriterestautant'), options)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  // getFavRest(): Promise<number[]>{
  //   return Promise.resolve([10086]);
  //   //return this._fav_restaurant;
  // }
}
