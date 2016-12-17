import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {RestaurantService} from '../core/services/restaurant.service'
import {GeolocationService} from '../core/services/geolocation.service'

import {Subject} from 'rxjs/Subject';
import {Marker} from '../core/types';

@Component({
	selector: 'restaurant-home',
	templateUrl: './templates/restaurant-home.html'
})
export class RestauranteHomeComponent implements OnInit {

	// The core communication middleware with google map
	current_loc: Marker = {
		lat: -33.8858032,
		lng: 151.1883326,
		label: 'You',
		draggable: true,
		addr: ''
	};

	searchAddr = new Subject<string>();

	constructor(private restService: RestaurantService,
	            private geoService: GeolocationService,
	            private router: Router) {
	}


	ngOnInit() {
		// ask for user's current geo loc
		this.geoService.getLocation({timeout: 200000, maximumAge: 300000})
			.subscribe((pos) => {
				this.onSelectLocation({
					lat: pos.coords.latitude,
					lng: pos.coords.longitude
				} as Marker);
			}, (error) => {
				alert(error);
			}, () => {
				console.log('geo loc finished');
			});

		// Listen to the user's typed address input;
		// Submit the address name to GoogleGeo service to get lat/lng, then updates the google map.
		this.searchAddr.debounceTime(1500).distinctUntilChanged().subscribe(
			addr => {
				this.geoService.convert_geo(addr) // get lat and lng by address name
					.subscribe(resp => {
						if (resp.hasOwnProperty('results')) {
							let loc = resp['results'][0]['geometry']['location'];
							this.update_loc(loc);
						}
					}, error => console.log(error));
			}
		);
	}

	// UPDATERS
	update_loc(loc: Marker): void {
		this.geoService.convert_geo(loc, true) // true: reverse_geocoding, i.e, get address name by lat & lng
			.subscribe(resp => {
				if (resp.hasOwnProperty('results')) {
					// get address
					let addr = (resp['results'] ?
						resp['results'][0]['formatted_address'] :
						'Sorry, I can\'t find the address for this loc');

					// update current loc and update filter
					this.restService.updateFilter('lat', loc.lat);
					this.restService.updateFilter('lng', loc.lng);
					this.current_loc = {
						lat: loc.lat,
						lng: loc.lng,
						label: 'Y',
						draggable: true,
						addr: addr
					};
				}
			});
	}

	// EVENTS
	onSelectLocation(loc: Marker): void {
		this.update_loc(loc);
	}

	onInputAddress(addr: string): void {
		this.searchAddr.next(addr);
	}

	gotoRestaurantSuggestion(): void {
		this.router.navigate(['/restaurant/suggestion', this.restService.getFilter().url]);
	}
}
