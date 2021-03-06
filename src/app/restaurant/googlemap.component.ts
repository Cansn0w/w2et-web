import {Component, Input, Output} from '@angular/core';
import {EventEmitter, OnChanges, SimpleChange} from '@angular/core';
import {Router} from '@angular/router';

import {RestaurantService} from '../core/services/restaurant.service';
import {Restaurant} from '../core/classes/restaurant';
import {Observable} from 'rxjs/Observable';
import {Marker} from '../core/types';
import '../shared/vendors';

@Component({
  selector: 'google-map',
  templateUrl: './templates/googlemap.html',
  styleUrls: ['./templates/googlemap.css']
})

export class GoogleMapComponent implements OnChanges {

  zoom: number = 15;

  restaurants: Observable<Restaurant[]>;
  rst_icon_path: string = 'assets/restaurant_icon.png';

  @Input() showNearbyRestaurants: boolean;
  @Input() loc: Marker;
  @Output() onSelectLocation = new EventEmitter<any>();


  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    if (this.showNearbyRestaurants)
      this.restaurants = Observable.fromPromise(this.restService.fetchRestaurants());
  }

  constructor(
    private restService: RestaurantService,
    private router: Router
  ) { }

  // Events
  selectLoc($event: any): void {
    this.onSelectLocation.emit({
      lat: $event.coords.lat,
      lng: $event.coords.lng
    });
  }

  clickRestaurant(rst: Restaurant): void {
    this.router.navigate(['/restaurant/detail', rst.id]);
  }
}
