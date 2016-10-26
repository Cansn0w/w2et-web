import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Recipe, RecipeService } from './recipe.service';
import {UserService} from '../com/user.service';

@Component({
	selector: 'recipe-detail',
	templateUrl: './templates/recipe-detail.html',
})
export class RecipeDetailComponent implements OnInit {

	recipe: Recipe;
	size: number = 4;

	constructor(
		private route: ActivatedRoute,
	    private recipeService: RecipeService,
		public user: UserService
	) { }

	ngOnInit() {
		this.route.params.forEach((params: Params) => {
			let id = +params['id'];
			this.recipeService.fetchRecipeDetails(id)
				.subscribe(
					recipe => {
						this.recipe = recipe;
						console.log(recipe.ingredients);
					},
					error => console.log(error)
				);
		});
	}

	icon_yes_no(isYes: boolean) {
		if (isYes)
			return "glyphicon glyphicon-ok-circle";
		else
			return "glyphicon glyphicon-remove-sign";
	}
}
