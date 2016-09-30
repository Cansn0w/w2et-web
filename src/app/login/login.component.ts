import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'

import { UserService } from '../user.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginData: {email: string, password: string};

  constructor(
    private user: UserService,
    private router: Router
  ) { }

  submitLogin() {
    this.user.login(this.loginData.email, this.loginData.password);
    this.router.navigate(['']);
  }

  ngOnInit() {
    this.loginData = {email: '', password: ''};
  }

}
