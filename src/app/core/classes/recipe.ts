export class Recipe {
	id: any;

	name: string;
	image: string;
	url: string;

	dairyFree: boolean;
	glutenFree: boolean;
	vegetarian: boolean;

	ingredients: any[];
	instructions: string;
	duration: number;

	bookmarked: boolean;

	constructor(rcpData?: {}) {
		if (rcpData)
			for (let key in rcpData)
				this[key] = rcpData[key];
	}
}