import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';

import {RecipeModule} from './recipe/recipe.module';
import {RestaurantModule} from './restaurant/restaurant.module'
import {ProfileModule} from './profile/profile.module';
import {SharedModule} from './shared/shared.module'
import {CoreModule} from './core/core.module';

import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './auth/login.component';
import {SignupComponent} from './auth/signup.component';

import {app_routing} from './app-routing'

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,

    SharedModule,
    CoreModule,
    RecipeModule,
    RestaurantModule,
    ProfileModule,

    app_routing
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
