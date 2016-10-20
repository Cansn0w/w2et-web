import { Component } from '@angular/core';
import { UserService } from './user.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(
    private user: UserService
  ) { }

  loggedIn() {
    return this.user.isLoggedIn();
  }

  get username(){
    return this.user.getUsername();
  }
}
