import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ProfileComponent} from './profile.component'

import { Restaurant } from  '../restaurant/restaurant.service'
import { RestaurantService } from  '../restaurant/restaurant.service'
import { UserService } from '../user.service';
@Component({
  selector: 'profile-restaurant',
  templateUrl: 'profile-restaurant.component.html',
  // styleUrls: [ 'profile-recipe.component.css' ]
})
export class ProfileRestaurantComponent implements OnInit {
  selectedRestaurant: Restaurant;
  restaurants: Restaurant[];

  constructor (
    private router: Router,
    private userService: UserService){ }

  favRest(): void {
    this.userService.get_fav_restaurant().then(restaurants => this.restaurants = restaurants);
  }
  ngOnInit() {
    this.favRest();
  }


}


