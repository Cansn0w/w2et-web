import { NgModule } from '@angular/core';
import { ModalModule } from 'ng2-bootstrap';
import { TabsModule } from 'ng2-bootstrap';

import { RecipeModule } from '../recipe/recipe.module';
import { RestaurantModule } from '../restaurant/restaurant.module';
import { SharedModule } from '../shared/shared.module';

import { ProfileComponent } from './profile.component';
import { ProfileRecipeComponent } from './profile-recipe.component';
import { ProfileRestaurantComponent } from './profile-restaurant.component';
import { profileRouting } from './profile.routing'

@NgModule({
  imports: [
    RecipeModule,
    RestaurantModule,
    SharedModule,
    ModalModule,
    TabsModule,
    profileRouting
  ],

  declarations: [
    ProfileComponent,
    ProfileRecipeComponent,
    ProfileRestaurantComponent
  ]
})

export class ProfileModule {
}
