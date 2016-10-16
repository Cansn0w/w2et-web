import {Component, ViewChild, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {RestaurantFilterComponent} from './restaurant-filter.component'

import {Subject} from 'rxjs/Subject';

import {RestaurantService, Restaurant} from './restaurant.service'

@Component({
	selector: 'restaurant-list',
	templateUrl: './templates/restaurant-list.html'
})
export class RestaurantListComponent implements OnInit {

	@ViewChild(RestaurantFilterComponent)
	private filterComponent: RestaurantFilterComponent;

	private all_restaurants: Restaurant[] = [];
	private restaurants: Restaurant[] = [];
	private searchTerm = new Subject<{key: string, value: string}>();


	constructor(private router: Router,
	            private route: ActivatedRoute,
	            private restService: RestaurantService) {
	}

	// TMP helper
	get_category_list_of_rest(r: Restaurant): string[] {
		return r['categories'].map((c) => c['category']);
	}

	contains(lst: any[], val: any): boolean {

		// console.log(lst, val);
		for (let i of lst)
			if (i === val) {
				return true;
			}
		return false;
	}


	ngOnInit() {
		this.route.params.forEach((params: Params) => {
			// parse filter url components
			let latlng = params['options'].split(';');

			for (let opt in latlng) {
				let key = latlng[opt].split('=')[0];
				let value = latlng[opt].split('=')[1];
				this.restService.updateFilter([key, +value]);
			}
			// collect restaurants & set categories available for filtering
			this.restService.fetchRestaurants()
				.subscribe(restaurants => {
					this.all_restaurants = restaurants;
					this.restaurants = restaurants;
					this.setCategoryOptions();
				});

		});

		// config search
		this.searchTerm
			.debounceTime(500)      // wait for 0.5s pause in event
			.distinctUntilChanged() // ignore if next search option is the same as previous
			.subscribe((choice) => this.doFiltering(choice));
	}

	// FILTER FUNCTIONS
	setCategoryOptions(): void {
		let categories = [''];
		for (let r of this.all_restaurants) {
			let c = this.get_category_list_of_rest(r);
			categories = categories.concat(c);
		}
		this.filterComponent.setCategories(Array.from(new Set(categories)));
	}


	doFiltering(choice): void {
		switch(choice.key) {
			case 'category': this.filterByCategory(choice.value); break;
			case 'distance': this.filterByDistance(choice.value); break;
			case 'rating': this.filterByRaintgs(choice.value);   break;
		}
	}

	filterByCategory(category: string): void {
		this.restaurants = this.all_restaurants.filter((r) =>
			this.contains(this.get_category_list_of_rest(r), category));
	}

	filterByDistance(maxDistance: number): void {
		this.restaurants = this.all_restaurants.filter((r) => r.distance <= maxDistance);
	}

	filterByRaintgs(rating: number): void {
		// rank => rating range: r => [r, r + 1], e.g,
		// 1 => [1, 2]
		this.restaurants = this.all_restaurants.filter((r) => r.rating>= rating);
	}


	// EVENTS
	onFilterOptionSet(choice: any): void {
		this.searchTerm.next(choice);
	}

	onSelectRestaurant(rst: Restaurant): void {
		this.router.navigate(['/restaurant/detail', rst.id]);
	}
}
