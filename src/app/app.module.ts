import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { RestaurantComponent } from './restaurant/restaurant.component';
import { RecipeComponent } from './recipe/recipe.component';

import { W2etRoutingModule } from './app-routing.module'

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RestaurantComponent,
    RecipeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    W2etRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
