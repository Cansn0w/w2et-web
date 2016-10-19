import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {Restaurant} from  '../restaurant/restaurant.service'

import {UserService} from '../user.service';

@Component({
	selector: 'profile-restaurant',
	templateUrl: './templates/profile-fav-restaurants.html',
	// templateUrl: '../restaurant/templates/restaurant-list.html'
})
export class ProfileRestaurantComponent implements OnInit {
	// indicator to tell the template not to include filter component
	atProfile: boolean = true;

	restaurants: Restaurant[] = [];

	constructor(private router: Router,
	            private userService: UserService) {
	}

	ngOnInit() {
		this.favRest();
	}

	favRest(): void {
		this.userService.get_fav('restaurants').then(restaurants => this.restaurants = restaurants);
	}
}
