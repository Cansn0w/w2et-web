import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {Recipe} from  '../recipe/recipe.service'
import {UserService} from '../com/user.service';

@Component({
	selector: 'profile-recipe',
	templateUrl: '../recipe/templates/recipe-list.html',
})
export class ProfileRecipeComponent implements OnInit {
	// indicator to tell the template not to include the filter component
	atProfile: boolean = true;

	selectedRecipe: Recipe;
	recipes: Recipe[] = [];

	constructor(public user: UserService) {
	}

	ngOnInit() {
		this.getFavRecipes();
	}

	getFavRecipes(): void {
		this.user.fetchFav('recipes').then(recipes => this.recipes = recipes);
	}

	unfavRecipe(recipe: Recipe): void {
		this.user.unfav(recipe, (succ) => {
			if (succ)
				this.getFavRecipes();
			else
				alert('Sorry this recipe could not be removed...');
		})
	}
}


