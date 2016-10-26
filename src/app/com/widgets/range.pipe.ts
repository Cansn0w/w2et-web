import { Pipe, PipeTransform } from '@angular/core';

/*
 * Calling any of the bypassSecurityTrust... APIs disables Angular's built-in sanitization for the value passed in.
 * Carefully check and audit all values and code paths going into this call.
 *
 * Make sure any user data is appropriately escaped for this security context
 */

@Pipe({ name: 'range' })
export class RangePipe implements PipeTransform {
	constructor() {}
	transform(num): Array<number> {
		return Array(Math.ceil(num)).fill(null).map((x,i) => i);
	}
}