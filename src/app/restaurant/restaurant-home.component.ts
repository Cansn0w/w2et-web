import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {RestaurantService} from './restaurant.service'
import {GeolocationService, marker} from './geolocation.service'

import {Subject} from 'rxjs/Subject';

@Component({
	selector: 'restaurant-home',
	templateUrl: './templates/restaurant-home.html'
})
export class RestauranteHomeComponent implements OnInit {

	current_loc: marker = new marker(
		-33.8858032, 151.1883326, 'You', true, ''
	);

	searchAddr = new Subject<string>();

	constructor(private restService: RestaurantService,
	            private geoService: GeolocationService,
	            private router: Router) {
	}


	ngOnInit() {
		// ask for user's current geo location
		this.geoService.getLocation({timeout: 200000, maximumAge: 300000})
			.subscribe((pos) => {
				this.onSelectLocation(new marker(
					pos.coords.latitude,
					pos.coords.longitude
				));
			}, (error) => {
				alert(error);
			}, () => {
				console.log('geo location finished');
			});

		// config address search
		this.searchAddr.debounceTime(1000).distinctUntilChanged().subscribe(
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
	update_loc(loc: marker): void {
		this.geoService.convert_geo(loc, true) // true: reverse_geocoding, i.e, get address name by lat & lng
			.subscribe(resp => {
				if (resp.hasOwnProperty('results')) {
					// get address
					let addr = (resp['results'] ?
						resp['results'][0]['formatted_address'] :
						'Sorry, I can\t find the address for this location');

					// update current location and update filter
					this.restService.updateFilter('lat', loc.lat);
					this.restService.updateFilter('lng', loc.lng);
					this.current_loc = new marker(loc.lat, loc.lng, 'Y', true, addr);
				}
			});
	}

	// EVENTS
	onSelectLocation(loc: marker): void {
		this.update_loc(loc);
	}

	onInputAddress(addr: string): void {
		this.searchAddr.next(addr);
	}

	gotoRestaurantSuggestion(): void {
		this.router.navigate(['/restaurant/suggestion', this.restService.getFilter().url]);
	}
}
