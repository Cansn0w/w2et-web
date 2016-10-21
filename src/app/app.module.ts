import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';

import {RecipeModule} from './recipe/recipe.module';
import {RestaurantModule} from './restaurant/restaurant.module'
import {ProfileModule} from './profile/profile.module';
import {SharedModule} from './com/shared.module'

import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {SigninComponent} from './auth/signin.component';

import {UserService} from './user.service'
import {AuthService} from './auth/auth.service'
import {app_routing} from './app-routing'

@NgModule({
	imports: [
		BrowserModule,
		HttpModule,

		SharedModule,
		RecipeModule,
		RestaurantModule,
		ProfileModule,

		app_routing
	],
	declarations: [
		AppComponent,
		HomeComponent,
		SigninComponent,
	],
	providers: [
		UserService,
		AuthService,
	],
	bootstrap: [AppComponent]
})

export class AppModule {
}
