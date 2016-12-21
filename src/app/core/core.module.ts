import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { ProfileGuard } from './guards/profile.guard';
import { SessionGuard } from './guards/session.guard';

import { UtilService } from './services/util.service'
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { RecipeService } from './services/recipe.service';
import { RestaurantService } from './services/restaurant.service';
import { GeolocationService } from './services/geolocation.service';
import { FacebookService } from 'ng2-facebook-sdk/dist';
import { FacebookInitialiser } from './services/fb.initialiser';
import { QuestionControlService } from './services/question-control.service';

@NgModule({
	imports: [SharedModule],
	providers: [
		ProfileGuard,
		SessionGuard,

		RecipeService,
		UtilService,
		FacebookService,
		UserService,
		AuthService,
		RestaurantService,
		GeolocationService,
		QuestionControlService,

		FacebookInitialiser
	]
})

export class CoreModule {}