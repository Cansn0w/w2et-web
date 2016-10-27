import {Component, Output, EventEmitter} from '@angular/core';

@Component({
	selector: 'recipe-filter',
	templateUrl: './templates/recipe-filter.html',  // todo: input validation styling
})
export class RecipeFilterComponent {

  selected_diet = 'Filter by Diet';
  selected_cuisine = 'Filter by Cuisine';
  selected_intolerance = 'Exclude intolerance';

  diet_options = ['', 'Pescetarian', 'Vegetarian', 'Vegan', 'Paleo', 'Primal'];
	cuisine_options = ['', 'African', 'Chinese', 'Japanese', 'Korean', 'Vietnamese', 'Thai', 'Indian', 'British', 'Irish', 'French', 'Italian', 'Mexican', 'Spanish', 'Middle eastern', 'Jewish', 'American', 'Cajun', 'Southern', 'Greek', 'German', 'Nordic', 'Eastern European', 'Caribbean', 'Latin American'];
	intolerance_options = ['', 'Dairy', 'Egg', 'Gluten', 'Peanut', 'Sesame', 'Seafood', 'Shellfish', 'Soy', 'Sulfite', 'Tree nut', 'And wheat'];

	@Output() onFilterOptionSet = new EventEmitter<any>();

	setOption(key, value) {
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

	get url(): string {
		let options = [];
		for (let key in this)
			if (this[key] && typeof this[key] !== 'function')
				options.push(key + '=' + this[key]);

		return options.join(';')
	}
}
