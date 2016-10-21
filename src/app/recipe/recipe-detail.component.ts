import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Recipe, RecipeService } from './recipe.service';



@Component({
	selector: 'recipe-detail',
	templateUrl: './templates/recipe-detail.html',
})
export class RecipeDetailComponent implements OnInit {

	recipe: Recipe = new Recipe();

	constructor(
		private route: ActivatedRoute,
	    private router: Router,
	    private recipeService: RecipeService,
	) { }

	ngOnInit() {
		this.route.params.forEach((params: Params) => {
			let id = +params['id'];
			this.recipeService.fetchRecipeDetails(id)
				.subscribe(
					recipe => {
						this.recipe = recipe
					},
					error => console.log(error)
				);
		});
	}
}
