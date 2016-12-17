import { Pipe, PipeTransform } from '@angular/core';

/*
 * The pipe mimics the 'range()' function in python
 * Returns an incremental number array of length 'num'.
 */

@Pipe({ name: 'range' })
export class RangePipe implements PipeTransform {
	constructor() {}
	transform(num: number): Array<number> {
		console.log(num);
		if (num) {
			return Array(Math.ceil(num)).fill(null).map((x,i) => i);
		}
	}
}