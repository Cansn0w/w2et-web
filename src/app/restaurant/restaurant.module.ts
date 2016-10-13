import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RestaurantComponent } from './restaurant.component';

import {restaurantRouting} from './restaurant.routing'


@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		restaurantRouting
	],

	declarations: [
		RestaurantComponent,
	],

	providers: [
	]
})

export class RestaurantModule {}