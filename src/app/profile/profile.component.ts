import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router'

import {UserService} from '../user.service'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',  //<a routerLink="/recipes" routerLinkActive="active">Recipes</a>
  //styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  constructor(
    private user: UserService,
    private router: Router
  )

  { }

  get email() {
    return this.user.getEmail();
  }

  get username(){
    return this.user.getUsername();
  }

}
