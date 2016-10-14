import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { RecipeService } from './recipe.service';

@Component({
	selector: 'recipe-home',
	templateUrl: './templates/recipe-home.html'
})
export class RecipeHomeComponent implements OnInit {

	constructor(
		private recipeService: RecipeService,
		private router: Router
	) {}


	ngOnInit() {
		// stub
	}

	gotoList(): void {
		this.router.navigate(['/recipe/list', this.recipeService.getFilter().toJson()])
	}

	onFilterOptionSet(choice: any) {
		this.recipeService.updateFilter(choice.key, choice.value);
	}
}