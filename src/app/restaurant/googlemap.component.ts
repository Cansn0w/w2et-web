import {Component, Input, Output} from '@angular/core';
import {EventEmitter, OnInit, OnChanges, SimpleChange} from '@angular/core';
import {Router} from '@angular/router';

import {RestaurantService, Restaurant} from './restaurant.service'
import {marker} from './geolocation.service'
import {Observable} from 'rxjs/Observable';

@Component({
	selector: 'google-map',
	templateUrl: './templates/googlemap.html',
	styleUrls: ['./templates/googlemap.css']
})

export class GoogleMapComponent implements OnInit, OnChanges {

	// user's current location
	zoom: number = 15;

	restaurants: Observable<Restaurant[]>;
	rst_icon_path: string = 'assets/restaurant_icon.png';

	@Input() showNearbyRestaurants: boolean;
	@Input() loc: marker;
	@Output() onSelectLocation = new EventEmitter<any>();


	ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
		if (this.showNearbyRestaurants)
			this.restaurants = this.restService.fetchRestaurants();
	}

	constructor(private restService: RestaurantService,
	            private router: Router) {
	}

	ngOnInit() {
	}

	// Events
	selectLoc($event: any): void {
		this.onSelectLocation.emit({
			lat: $event.coords.lat,
			lng: $event.coords.lng
		});
	}

	clickRestaurant(rst: Restaurant): void {
		this.router.navigate(['/restaurant/detail', rst.id]);
	}
}