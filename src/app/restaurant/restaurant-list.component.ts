import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';

import {RestaurantService, Restaurant} from './restaurant.service'

@Component({
	selector: 'restaurant-list',
	templateUrl: './templates/restaurant-list.html'
})
export class RestaurantListComponent implements OnInit {

	restaurants: Restaurant[] = [];


	constructor(private router: Router,
	            private route: ActivatedRoute,
	            private restService: RestaurantService) {
	}

	ngOnInit() {

		this.route.params.forEach((params: Params) => {
			this.restService.fetchRestaurant({
				lat: +params['lat'],
				lng: +params['lng']
			}).subscribe(
				restaurants => {
					this.restaurants = restaurants;
				},
				error => console.log(error)
			)
		});
	}

	onSelectRestaurant(rst: Restaurant): void {
		console.log(rst);
		this.router.navigate(['/restaurant/detail', rst.id]);
	}
}
