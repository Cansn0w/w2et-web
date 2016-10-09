import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { RecipeModule } from './recipe/recipe.module'


import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { RestaurantComponent } from './restaurant/restaurant.component';
import { SigninComponent } from './auth/signin.component';

import { ProfileComponent } from './profile/profile.component';

import { UserService } from './user.service'
import { AuthService } from './auth/auth.service'
import { app_routing } from './app-routing'

@NgModule({
	imports: [
		NgbModule,
		BrowserModule,
		FormsModule,
		HttpModule,
		RecipeModule,
		app_routing
	],
	declarations: [
		AppComponent,
		HomeComponent,
		RestaurantComponent,
		SigninComponent,
		ProfileComponent,
	],
	providers: [UserService, AuthService],
	bootstrap: [AppComponent]
})
export class AppModule { }
