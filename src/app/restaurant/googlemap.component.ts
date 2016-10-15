import {Component, Input, Output} from '@angular/core';
import {EventEmitter, OnInit, OnChanges, SimpleChange} from '@angular/core';
import {Router} from '@angular/router';

import {RestaurantService, Restaurant} from './restaurant.service'
import {marker} from './geolocation.service'
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

@Component({
	selector: 'google-map',
	templateUrl: './templates/googlemap.html',
	styleUrls: ['./templates/googlemap.css']
})

export class GoogleMapComponent implements OnInit, OnChanges {

	// user's current location
	zoom: number = 15;

	restaurants: Observable<Restaurant[]>;
	loc_emitter = new Subject<marker>();
	rst_icon_path: string = 'assets/restaurant_icon.png';

	@Input() loc: marker;
	@Output() onSelectLocation = new EventEmitter<any>();


	ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
		let new_loc = changes['loc']['currentValue'];
		this.loc_emitter.next(new marker(new_loc.lat, new_loc.lng));
	}


	constructor(private restService: RestaurantService,
	            private router: Router) {
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

	// Events
	locDragEnd($event: any): void {
		this.onSelectLocation.emit({
			lat: $event.coords.lat,
			lng: $event.coords.lng
		});
	}

	onClickRestaurant(rst: Restaurant): void {
		this.router.navigate(['/restaurant/detail', rst.id]);
	}
}