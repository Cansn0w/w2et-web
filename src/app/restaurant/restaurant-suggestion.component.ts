import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';

import {Restaurant, RestaurantService} from './restaurant.service';
import {UserService} from '../com/user.service';

@Component({
	selector: 'recipe-suggestion',
	templateUrl: './templates/restaurant-suggestion.html'
})
export class RestaurantSuggestionComponent implements OnInit {

	private suggestedRestaurant: Restaurant;

	constructor(public user: UserService,
	            private restService: RestaurantService,
	            private router: Router,
	            private route: ActivatedRoute) {
	}


	ngOnInit() {
		this.route.params.forEach((params: Params) => {
			let filter_url = params['options'];
			this.restService.searchRestaurants(filter_url)
				.then(restaurants => {
					restaurants.map(r => this.user.hasFavored(r) ? r.bookmarked = true: r.bookmarked = false);
					this.restService.saveSearch(filter_url, restaurants);

					// pick the best rated restaurant
					restaurants.sort((ra, rb) => rb.rating - ra.rating);
					this.suggestedRestaurant = restaurants[0];
			});
		});
	}

	gotoRestaurantList(): void {
		this.router.navigate(['/restaurant/list', this.restService.getFilter().url]);
	}
}