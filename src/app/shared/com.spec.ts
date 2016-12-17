
/*
 * Unit tests on shared utility functions:
 */

import {RangePipe} from './pipes/range.pipe';
import {UtilService} from '../core/services/util.service';


describe('RangePipeTest', () => {
	let pipe = new RangePipe();
	it('transform "3" to "[0, 1, 2]"', () => {
		expect(pipe.transform(3)).toEqual([0,1,2]);
	});
	it('transform "1.2" to "[0, 1]"', () => {
		expect(pipe.transform(1.2)).toEqual([0,1]);
	})
});

describe('HelperUtiliityTests', () => {
	let helper = new UtilService();

	it('list [1, "yo", 3] should contain 1', () => {
		let lst = [1, 'yo', 3];
		expect(helper.contains(lst, 3))
			.toEqual(true);
	});

	it('"bad" should be removed from ["bad", "good", 2]', () => {
		let lst = ["bad", "good", 2];
		expect(helper.removeItem(lst, "bad"))
			.toEqual(["good", 2]);
	});

	it('filter url should be parsed to filter components', () => {
		let url = 'keyword=noodles;diet=vegan;cuisine=chinese';
		expect(helper.parseUrlString(url))
			.toEqual([
				{key: 'keyword', value: 'noodles'},
				{key: 'diet', value: 'vegan'},
				{key: 'cuisine', value: 'chinese'},
			]);
	})
});
