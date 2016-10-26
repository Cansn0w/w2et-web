import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';

import {Restaurant, RestaurantService} from './restaurant.service';
import {UserService} from '../com/user.service';

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
				.subscribe(
					restaurant => {
						if (this.user.hasFavored(restaurant)) restaurant.bookmarked = true;
						this.restaurant = restaurant;
					},
					error => console.log(error)
				);
		});
	}

	bookmark(rst): void {
		rst.bookmarked = !rst.bookmarked;
	}
}
