import { Component, OnInit } from '@angular/core';
import { Restaurant } from  '../core/classes/restaurant';

import { UserService } from '../core/services/user.service';

@Component({
	selector: 'profile-restaurant',
	templateUrl: '../restaurant/templates/restaurant-list.html'
})
export class ProfileRestaurantComponent implements OnInit {
	// indicator to tell the template not to include filter component
	atProfile: boolean = true;

	restaurants: Restaurant[] = [];

	constructor(public user: UserService) {
	}

	ngOnInit() {
		this.getFavRestaurants();
	}

	getFavRestaurants(): void {
		this.user.fetchFav('restaurants').then(restaurants => this.restaurants = restaurants);
	}

	unfavRestaurant(rest: Restaurant): void {
		this.user.unfav(rest).then(ok => ok ? this.getFavRestaurants() : alert('Sorry this restaurant could not be removed...'));
	}
}
