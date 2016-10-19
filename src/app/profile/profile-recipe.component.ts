import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {Recipe} from  '../recipe/recipe.service'
import {UserService} from '../user.service';

@Component({
	selector: 'profile-recipe',
	templateUrl: './templates/profile-fav-recipes.html',
	// templateUrl: '../recipe/templates/recipe-list.html',
})
export class ProfileRecipeComponent implements OnInit {
	// indicator to tell the template not to include filter component
	atProfile: boolean = true;

	selectedRecipe: Recipe;
	recipes: Recipe[] = [];

	constructor(private router: Router,
	            private userService: UserService) {
	}

	ngOnInit() {
		this.favRec();
	}

	favRec(): void {
		this.userService.get_fav('recipes').then(recipes => this.recipes = recipes);
	}
}


