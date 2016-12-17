import { Injectable } from '@angular/core';

@Injectable()
export class UtilService {
	constructor() {
	}

	// check if a value is contained in a list.
	// if identifier key if provided, use this key to search for the value
	contains(lst: any[], val: any, identifier?: any): boolean {
		if (identifier) {
			for (let i of lst)
				if (i[identifier] == val[identifier])
					return true;
			return false;
		}

		return lst.indexOf(val) != -1;
	}

	// remove an element from list
	removeItem(lst: any[], item: any): any[] {
		lst.splice(lst.indexOf(item), 1);
		return lst;
	}

	handleError(error: any): Promise<any> {
		console.error('Oppps!', error);
		return Promise.reject(error.message || error);
	}

	// parse filter url in format 'diet=vegan;cuisine=chinese' to {key: diet, value:vegan} .. format
	parseUrlString(url: string): any[] {
		let parts = url.split(';');
		let results = [];
		for (let i in parts) {
			let key = parts[i].split('=')[0];
			let value = parts[i].split('=')[1];
			results.push({key: key, value: value});
		}

		return results;
	}
}
