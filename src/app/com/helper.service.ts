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

}