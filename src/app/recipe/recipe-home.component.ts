import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { RecipeService } from '../core/services/recipe.service';

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
    this.recipeService.resetFilter();
  }

  isValidFiilter(): boolean {
    return this.recipeService.validateFilter();
  }

  // EVENTS
  onFilterOptionSet(choice: any) {
    this.recipeService.updateFilter(choice.key, choice.value);
  }

  gotoList(): void {
    this.router.navigate(['/recipe/list', this.recipeService.getFilter().url])
  }
}
