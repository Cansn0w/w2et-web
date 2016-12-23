import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * Calling any of the bypassSecurityTrust... APIs disables Angular's built-in sanitization for the value passed in.
 * Carefully check and audit all values and code paths going into this call.
 *
 * Make sure any user data is appropriately escaped for this security context
 */

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
