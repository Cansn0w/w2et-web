import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { RestaurantService } from '../core/services/restaurant.service';
import { Restaurant } from '../core/classes/restaurant';
import { UserService } from '../core/services/user.service';

@Component({
  selector: 'recipe-suggestion',
  templateUrl: './templates/restaurant-suggestion.html'
})
export class RestaurantSuggestionComponent implements OnInit {

  private suggestedRestaurant: Restaurant;

  constructor(
    public user: UserService,
    private restService: RestaurantService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  /**
   * 1. Search for restaurants using user's previously set filter options
   * 2. Cache the search result so that found restaurants are displayed immediately if user wants to view more.
   * 3. Pick the best rated restaurant as suggested one.
   */
  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      let filter_url = params['options'];
      // search for restaurants using user's previously set filter options
      this.restService.searchRestaurants(filter_url)
        .then(restaurants => {
          restaurants.map(r => this.user.hasFavored(r) ? r.bookmarked = true: r.bookmarked = false);
          // cache the search result so that found restaurants are displayed
          this.restService.saveSearch(filter_url, restaurants);

          // pick the best rated restaurant
          restaurants.sort((ra, rb) => rb.rating - ra.rating);
          this.suggestedRestaurant = restaurants[0];
      });
    });
  }

  gotoRestaurantList(): void {
    this.router.navigate(['/restaurant/list', this.restService.getFilter().url]);
  }
}
