import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';

import {Restaurant, RestaurantService} from './restaurant.service'
import {marker} from './geolocation.service'

@Component({
	selector: 'restaurant-detail',
	templateUrl: './templates/restaurant-detail.html'
})
export class RestaurantDetailComponent implements OnInit {

	restaurant: Restaurant;
	loc: marker;


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
						this.loc = {
							lat: +this.restaurant.coordinate.split(',')[0],
							lng: +this.restaurant.coordinate.split(',')[1]
						}
					},
					error => console.log(error)
				);
		});
	}
}
