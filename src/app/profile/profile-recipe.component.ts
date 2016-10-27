import {Component, OnInit} from '@angular/core';
import {trigger, state, style, transition, animate} from '@angular/core';

import {Recipe} from  '../recipe/recipe.service'
import {UserService} from '../com/user.service';

@Component({
	selector: 'profile-recipe',
	templateUrl: '../recipe/templates/recipe-list.html',
	animations: [
		trigger('flyInOut', [
			state('in', style({height: '*'})),
			transition('void => *', [
				style({height: '*'}),
				animate(3000, style({height: 0}))
			])
		])
	]
	// animations: [
	// 	trigger('flyInOut', [
	// 		state('in', style({transform: 'translateX(0)'})),
	// 		transition('void => *', [
	// 			style({transform: 'translateX(-100%)'}),
	// 			animate(1000)
	// 		]),
	// 		transition('* => void', [
	// 			animate(1000, style({transform: 'translateX(100%)'}))
	// 		])
	// 	])
	// ]
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


