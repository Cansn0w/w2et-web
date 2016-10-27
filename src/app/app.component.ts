import { Component, ViewContainerRef} from '@angular/core';
import { UserService } from './com/user.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(
    private user: UserService,
    private router: Router,
    private viewContainerRef: ViewContainerRef
  ) { }

  jump(link: string): void {
    this.router.navigate([link]);
  }

  loggedIn() {
    return this.user.isLoggedIn();
  }

  get username(){
    return this.user.getUsername();
  }
}
