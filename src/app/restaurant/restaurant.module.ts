import { NgModule } from '@angular/core';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { SharedModule } from '../shared/shared.module';
import { DropdownModule } from 'ng2-bootstrap';

import { RestaurantComponent } from './restaurant.component';
import { RestauranteHomeComponent } from './restaurant-home.component';
import { RestaurantDetailComponent } from './restaurant-detail.component';
import { RestaurantSuggestionComponent } from './restaurant-suggestion.component';
import { RestaurantListComponent } from './restaurant-list.component';
import { RestaurantFilterComponent } from './restaurant-filter.component';

import { GoogleMapComponent } from './googlemap.component'

import { restaurantRouting } from './restaurant.routing'
import { GOOGLE_MAP_API_KEY } from '../shared/vendors'


@NgModule({
  imports: [
    SharedModule,
    AgmCoreModule.forRoot({
      apiKey: GOOGLE_MAP_API_KEY
    }),
    restaurantRouting,
    DropdownModule,
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
    RestaurantDetailComponent,
    RestaurantFilterComponent,
  ]
})

export class RestaurantModule {
}
