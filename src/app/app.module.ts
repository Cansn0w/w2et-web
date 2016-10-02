import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { RecipeModule } from './recipe/recipe.module'

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { RestaurantComponent } from './restaurant/restaurant.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';

import { UserService } from './user.service'
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
		LoginComponent,
		ProfileComponent
	],
	providers: [UserService],
	bootstrap: [AppComponent]
})
export class AppModule { }
