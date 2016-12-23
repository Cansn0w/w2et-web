import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Http, Response} from '@angular/http';

import {GOOGLE_MAP_API_KEY} from '../../shared/vendors'
import {LngLat} from '../types';

const GEOLOCATION_ERRORS = {
  'errors.location.unsupportedBrowser': 'Browser does not support loc services',
  'errors.location.permissionDenied': 'You have rejected access to your loc',
  'errors.location.positionUnavailable': 'Unable to determine your loc',
  'errors.location.timeout': 'Service timeout has been reached'
};

@Injectable()
export class GeolocationService {

  constructor(private http: Http) {
  }

  private handleError(error: any): Promise<any> {
    console.error('Oppps!', error);
    return Promise.reject(error.message || error);
  }

  public convertGeo(geoinfo: any, reverse = false): Observable<any> {
    let formatted_url = reverse ?
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${geoinfo.lat},${geoinfo.lng}&key=${GOOGLE_MAP_API_KEY}` :
      `https://maps.googleapis.com/maps/api/geocode/json?address=${geoinfo}&key=${GOOGLE_MAP_API_KEY}`;
    return this.http.get(formatted_url)
      .map((r: Response) => r.json())
      .catch(this.handleError);
  }

  /**
   *
   * Credit: https://gist.github.com/sasha7/0c32f3686eb49d44ccc8
   *
   * Obtains the geographic position, in terms of latitude and longitude coordinates, of the device.
   * @param {Object} [opts] An object literal to specify one or more of the following attributes and desired values:
   *   - enableHighAccuracy: Specify true to obtain the most accurate position possible, or false to optimize in favor of performance and power consumption.
   *   - timeout: An Integer value that indicates the time, in milliseconds, allowed for obtaining the position.
   *              If timeout is Infinity, (the default value) the loc request will not time out.
   *              If timeout is zero (0) or negative, the results depend on the behavior of the loc provider.
   *   - maximumAge: An Integer value indicating the maximum age, in milliseconds, of cached position information.
   *                 If maximumAge is non-zero, and a cached position that is no older than maximumAge is available, the cached position is used instead of obtaining an updated loc.
   *                 If maximumAge is zero (0), watchPosition always tries to obtain an updated position, even if a cached position is already available.
   *                 If maximumAge is Infinity, any cached position is used, regardless of its age, and watchPosition only tries to obtain an updated position if no cached position data exists.
   * @returns {Observable} An observable sequence with the geographical loc of the device running the client.
   */
  public getLocation(opts): Observable<any> {
    return Observable.create(observer => {

      if (window.navigator && window.navigator.geolocation) {
        window.navigator.geolocation.getCurrentPosition(
          (position) => {
            observer.next(position);
            observer.complete();
          },
          (error) => {
            switch (error.code) {
              case 1:
                observer.error(GEOLOCATION_ERRORS['errors.loc.permissionDenied']);
                break;
              case 2:
                observer.error(GEOLOCATION_ERRORS['errors.loc.positionUnavailable']);
                break;
              case 3:
                observer.error(GEOLOCATION_ERRORS['errors.loc.timeout']);
                break;
            }
          },
          opts);
      }
      else {
        observer.error(GEOLOCATION_ERRORS['errors.loc.unsupportedBrowser']);
      }
    });
  }
}
