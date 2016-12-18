import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';

import {RestaurantService} from '../core/services/restaurant.service';
import {Restaurant} from '../core/classes/restaurant';
import {UserService} from '../core/services/user.service';

@Component({
	selector: 'restaurant-detail',
	templateUrl: './templates/restaurant-detail.html'
})
export class RestaurantDetailComponent implements OnInit {

	restaurant: Restaurant;

	constructor(private restService: RestaurantService,
	            private route: ActivatedRoute,
	            public user: UserService) {
	}

	ngOnInit() {
		this.route.params.forEach((params: Params) => {
			let id = params['id'];
			this.restService.fetchRestaurantDetail(id)
				.then ((restaurant: Restaurant) => {
						if (this.user.hasFavored(restaurant)) restaurant.bookmarked = true;
						this.restaurant = restaurant;
					}
				).catch(console.error);
		});
	}

	bookmark(rst): void {
		rst.bookmarked = !rst.bookmarked;
	}
}
