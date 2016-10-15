import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';

import {RestaurantService, Restaurant} from './restaurant.service'
import {UserService} from '../user.service'
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

	constructor(private user: UserService,
	            private restService: RestaurantService,
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
				console.log('geo location service has done its job!');
			});

		// config address search
		this.searchAddr.debounceTime(1000).distinctUntilChanged().subscribe(
			addr => {
				this.geoService.convert_geo(addr)
					.subscribe(resp => {
						if (resp.hasOwnProperty('results')) {
							let loc = resp['results'][0]['geometry']['location'];
							this.current_loc.lat = loc['lat'];
							this.current_loc.lng = loc['lng'];
							this.update_address(this.current_loc, (addr) => this.current_loc.addr = addr);
						}
					}, error => console.log(error));
			}
		);
	}

	update_address(loc: marker, callback): void {
		this.geoService.convert_geo(loc, true) // true: reverse_geocoding, i.e, get address name by lat & lng
			.subscribe(resp => {
				if (resp.hasOwnProperty('results')) {
					callback(resp['results'] ?
						resp['results'][0]['formatted_address'] :
						'Sorry, I can\t find the address for this location');
				}
			});
	}

	// EVENTS
	onSelectLocation(loc: marker): void {
		this.update_address(loc, (addr) => {
			this.current_loc = new marker(
				loc.lat, loc.lng, 'You', true, addr
			)
		});
	}

	onInputAddress(addr: string): void {
		this.searchAddr.next(addr);
	}

	gotoRestaurantSuggestion(): void {
		this.router.navigate(['/restaurant/list', {
			lat: this.current_loc.lat,
			lng: this.current_loc.lng
		}]);
	}
}
