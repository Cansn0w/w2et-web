import {Component, Output, EventEmitter} from '@angular/core';

@Component({
	selector: 'recipe-filter',
	templateUrl: './templates/recipe-filter.html',
})
export class RecipeFilterComponent {

	diet_options = ['', 'pescetarian', 'vegetarian', 'vegan', 'paleo', 'primal'];
	cuisine_options = ['', 'african', 'chinese', 'japanese', 'korean', 'vietnamese', 'thai', 'indian', 'british', 'irish', 'french', 'italian', 'mexican', 'spanish', 'middle eastern', 'jewish', 'american', 'cajun', 'southern', 'greek', 'german', 'nordic', 'eastern european', 'caribbean', 'latin american'];
	intolerance_options = ['', 'dairy', 'egg', 'gluten', 'peanut', 'sesame', 'seafood', 'shellfish', 'soy', 'sulfite', 'tree nut', 'and wheat'];

	@Output() onFilterOptionSet = new EventEmitter<any>();

	setOption(key, value) {
		if (key == 'keyword' && value == '')
			// ignore empty keyword option
			return;
		this.onFilterOptionSet.emit({key: key, value: value});
	}
}

export class RecipeFilter {
	keyword: string = '';
	cuisine: string = '';
	diet: string = '';
	intolerance: string = '';
	includedIngredieint: string = ''; // todo
	excludedIngredieint: string = ''; // todo

	constructor() {
	}

	public toUrl = (): string => {
		let options = [];
		for (let key in this)
			if (this[key] && typeof this[key] !== 'function')
				options.push(key + '=' + this[key]);

		return options.join(';')
	};
}
