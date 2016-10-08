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
				.then(recipe => {
					this.recipe = recipe;
					console.log(recipe);
				});
		});
	}

	go_back(): void {
		this.router.navigate(['/recipe/list', this.recipeService.last_filter.toJson()]);
	}

	go_next(): void {
		alert('this is a to-do')
	}
}
