import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'restaurant-filter',
  templateUrl: './templates/restaurant-filter.html'
})
export class RestaurantFilterComponent {

  @Output() onFilterOptionSet = new EventEmitter<any>();
  selected_rating = 'Filter by Rating';
  selected_distance = 'Filter by Distances';
  selected_category = 'Filter by Category';

  // ratings and distance are fixed standards
  ratings: any[] = [1, 2, 3, 4, 5];
  distances: any [] = [1500, 1250, 1000, 750, 500, 250];

  // categories depend on the restaurants found by geo-loc
  categories: string[] = [];

  setCategories(categories: string[]) {
    this.categories = ['', ...categories];
  }

  setOption(key, value) {
    this.onFilterOptionSet.emit({key: key, value: value});
  }
}

