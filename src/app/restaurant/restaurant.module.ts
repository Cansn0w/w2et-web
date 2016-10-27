import {NgModule} from '@angular/core';
import {AgmCoreModule} from 'angular2-google-maps/core';
import {SharedModule} from '../com/shared.module';

import {RestaurantComponent} from './restaurant.component';
import {RestauranteHomeComponent} from './restaurant-home.component';
import {RestaurantDetailComponent} from './restaurant-detail.component';
import {RestaurantSuggestionComponent} from './restaurant-suggestion.component';
import {RestaurantListComponent} from './restaurant-list.component';
import {RestaurantFilterComponent} from './restaurant-filter.component';

import {GoogleMapComponent} from './googlemap.component'

import {GeolocationService} from './geolocation.service'
import {RestaurantService} from './restaurant.service'
import {restaurantRouting} from './restaurant.routing'
import {GOOGLE_MAP_API_KEY} from '../com/config'


@NgModule({
	imports: [
		SharedModule,
		AgmCoreModule.forRoot({
			apiKey: GOOGLE_MAP_API_KEY
		}),
		restaurantRouting,
	],

	declarations: [
		RestaurantComponent,
		RestauranteHomeComponent,
		RestaurantSuggestionComponent,
		RestaurantListComponent,
		RestaurantDetailComponent,
		RestaurantFilterComponent,
		GoogleMapComponent,
	],

	exports: [
		RestaurantComponent,
		RestauranteHomeComponent,
		RestaurantListComponent,
		RestaurantDetailComponent,
		RestaurantFilterComponent,
		GoogleMapComponent,
	],

	providers: [
		GeolocationService,
		RestaurantService
	]
})

export class RestaurantModule {
}