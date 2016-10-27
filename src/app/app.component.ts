import {Component, ViewContainerRef} from '@angular/core';
import {UserService} from './com/user.service'

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
})
export class AppComponent {

	constructor(private user: UserService,
	            private viewContainerRef:ViewContainerRef) {
	}

	loggedIn() {
		return this.user.isLoggedIn();
	}

	get username() {
		return this.user.getUsername();
	}
}
