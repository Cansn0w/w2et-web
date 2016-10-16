import { Component, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'restaurant-filter',
	templateUrl: './templates/restaurant-filter.html'
})
export class RestaurantFilterComponent {

	@Output() onFilterOptionSet = new EventEmitter<any>();

	// ratings and distance are fixed standards
	ratings: any[] = ['', 1, 2, 3, 4, 5];
	distances: any[] = ['', 250, 500, 750, 1000, 1250, 1500];

	// categories depdend on the restaurants found by geo-location
	categories: string[] = [];

	constructor() {

	}

	setCategories(categories: string[]) {
		this.categories = categories;
	}

	setOption(key, value) {
		this.onFilterOptionSet.emit({key: key, value: value});
	}
}

export class RestaurantFilter {

	public lat: number = -33.8858032;
	public lng: number = 151.1883326;

	// these may become useful later...
	// public category: string = '';
	// public distance: number = 0;
	// public ratings: number = 0;
	// these may become useful later...

	constructor() {

	}

	public toUrl = (): string => {
		let options = [];
		for (let key in this)
			if (this[key] && typeof this[key] !== 'function')
				options.push(key + '=' + this[key]);

		return options.join(';')
	};
}