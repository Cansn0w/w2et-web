import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';

import {Restaurant, RestaurantService} from './restaurant.service';

@Component({
	selector: 'restaurant-detail',
	templateUrl: './templates/restaurant-detail.html'
})
export class RestaurantDetailComponent implements OnInit {

	restaurant: Restaurant;

	constructor(private restService: RestaurantService,
	            private route: ActivatedRoute,
	            private router: Router,) {
	}


	ngOnInit() {
		this.route.params.forEach((params: Params) => {
			let id = params['id'];
			this.restService.fetchRestaurantDetail(id)
				.subscribe(
					restaurant => {
						this.restaurant = restaurant;
					},
					error => console.log(error)
				);
		});
	}
}
