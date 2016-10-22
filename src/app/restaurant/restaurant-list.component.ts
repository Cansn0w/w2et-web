import {Component, ViewChild, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {RestaurantFilterComponent} from './restaurant-filter.component'

import {Subject} from 'rxjs/Subject';

import {RestaurantService, Restaurant} from './restaurant.service'
import {UserService} from '../user.service';
import {HelperService} from '../com/helper.service';

@Component({
	selector: 'restaurant-list',
	templateUrl: './templates/restaurant-list.html'
})
export class RestaurantListComponent implements OnInit {

	@ViewChild(RestaurantFilterComponent)
	private filterComponent: RestaurantFilterComponent;

	private all_restaurants: Restaurant[] = [];
	private restaurants: Restaurant[] = [];

	private all_ids: any[];
	private ids_by_category: Set<any>;
	private ids_by_ratings: Set<any>;
	private ids_by_distance: Set<any>;

	private searchTerm = new Subject<{key: string, value: string}>();

	constructor(public  user: UserService,
	            private helper: HelperService,
	            private route: ActivatedRoute,
	            private restService: RestaurantService) {
	}

	ngOnInit() {
		this.route.params.forEach((params: Params) => {
			let filter_url = params['options'];
			this.restService.searchRestaurants(filter_url)
				.then(restaurants => {
					restaurants.map(r => this.user.hasFavored(r) ? r.bookmarked = true: r.bookmarked = false);
					this.all_restaurants = restaurants;
					this.restaurants= restaurants;

					// filtering trackers
					this.all_ids = restaurants.map(r => r.id);
					this.ids_by_category = new Set(this.all_ids);
					this.ids_by_distance = new Set(this.all_ids);
					this.ids_by_ratings = new Set(this.all_ids);

					this.setCategoryOptions();
					this.restService.saveSearch(filter_url, restaurants);
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
			categories = categories.concat(r.flatterned_categories());
		}

		this.filterComponent.setCategories(Array.from(new Set(categories)));
	}

	doFiltering(choice): void {
		/*
		 * 1. update the ids of which restaurants' attributes match the corresponding search criteria.
		 * 2. get the id intersetction of three filter results
		 * 3. update restaurants list.
		 */
		switch(choice.key) {
			case 'category': this.filterByCategory(choice.value); break;
			case 'distance': this.filterByDistance(choice.value); break;
			case 'rating': this.filterByRaintgs(choice.value);   break;
		}

		let intersetction: Set<any> = new Set([...this.ids_by_category]
			.filter(x => this.ids_by_ratings.has(x))
			.filter(x => this.ids_by_distance.has(x)));

		this.restaurants = this.all_restaurants.filter(r => intersetction.has(r['id']));
	}

	filterByCategory(category: string): void {
		if (category == '') this.ids_by_category = new Set(this.all_ids);
		this.ids_by_category = new Set(this.all_restaurants.filter(r => this.helper.contains(r.flatterned_categories(), category)).map(r => r.id));
	}

	filterByDistance(maxDistance: number): void {
		this.ids_by_distance = new Set(this.all_restaurants.filter((r) => r.distance <= maxDistance).map(r => r['id']));
	}

	filterByRaintgs(minRating: number): void {
		this.ids_by_ratings = new Set(this.all_restaurants.filter((r) => r.rating>= minRating).map(r => r['id']));
	}


	// EVENTS
	onFilterOptionSet(choice: any): void {
		this.searchTerm.next(choice);
	}
}
