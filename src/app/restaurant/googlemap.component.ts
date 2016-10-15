import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {RestaurantService, Restaurant} from './restaurant.service'
import {GeolocationService, marker} from './geolocation.service'
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

@Component({
	selector: 'google-map',
	templateUrl: './templates/googlemap.html',
	styleUrls: ['./templates/googlemap.css']
})

export class GoogleMapComponent implements OnInit {

	// user's current location
	loc: marker;
	zoom: number = 15;

	restaurants: Observable<Restaurant[]>;
	loc_emitter = new Subject<marker>();

	@Input()
	set current_loc(current_loc: marker) {
		this.loc = current_loc;
		this.loc_emitter.next(this.loc);
	}
	get current_loc() { return this.loc; }

	@Output() onSelectLocation = new EventEmitter<any>();


	constructor(private geoService: GeolocationService,
	            private restService: RestaurantService) {
	}

	ngOnInit() {
		this.restaurants = this.loc_emitter
			.distinctUntilChanged()
			.switchMap(loc => {
				return this.restService.fetchRestaurant(loc);
			})
			.catch(error => {
				console.error('Opps!', error);
				return Observable.of<Restaurant[]>([]);
			});
	}

	locDragEnd($event: any): void {
		// let m = new marker(
		// 	$event.coords.lat,
		// 	$event.coords.lng,
		// );
		// tell parent component here is something new ...
		this.onSelectLocation.emit({
			lat: $event.coords.lat,
			lng: $event.coords.lng
		});
	}
}