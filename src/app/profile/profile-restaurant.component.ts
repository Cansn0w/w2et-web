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
	            private user: UserService) {
	}

	ngOnInit() {
		this.getFavRestaurants();
	}

	getFavRestaurants(): void {
		this.user.get_fav('restaurants').then(restaurants => this.restaurants = restaurants);
	}

	unfavRestaurant(rest: Restaurant): void {
		this.user.unfav(rest, (succ) => {
			if (succ)
				this.getFavRestaurants();
			else
				alert('Sorry this restaurant could not be removed...');
		})
	}
}
