import {Injectable} from '@angular/core';

@Injectable()
export class HelperService {
	constructor() {}

	contains(lst: any[], val: any, identifier?: any): boolean {
		if (identifier) {
			for (let i of lst)
				if (i[identifier] == val[identifier])
					return true;
			return false;
		}

		return lst.indexOf(val) != -1;
	}

	removeItem(lst: any[], item: any): any[] {
		lst.splice(lst.indexOf(item), 1);
		return lst;
	}

	handleError(error: any): Promise<any> {
		console.error('Oppps!', error);
		return Promise.reject(error.message || error);
	}

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
