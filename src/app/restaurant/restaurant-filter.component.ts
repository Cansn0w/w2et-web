import {Component, Output, EventEmitter} from '@angular/core';

@Component({
	selector: 'restaurant-filter',
	templateUrl: './templates/restaurant-filter.html'
})
export class RestaurantFilterComponent {

	@Output() onFilterOptionSet = new EventEmitter<any>();

	// ratings and distance are fixed standards
	ratings: any[] = [ , 1, 2, 3, 4, 5];
	distances: any [] = [ , 1500, 1250, 1000, 750, 500, 250];

	// categories depend on the restaurants found by geo-location
	categories: string[] = [];

	constructor() {
	}

	setCategories(categories: string[]) {
		this.categories = [''].concat(categories);
	}

	setOption(key, value) {
		this.onFilterOptionSet.emit({key: key, value: value});
	}
}

export class RestaurantFilter {

	public lat: number = -33.8858032;
	public lng: number = 151.1883326;


	constructor() {

	}

	get url(): string {
		let options = [];
		for (let key in this)
			if (this[key] && typeof this[key] !== 'function')
				options.push(key + '=' + this[key]);

		return options.join(';')
	}
}
