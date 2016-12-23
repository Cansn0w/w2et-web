import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { UserService } from '../services/user.service';
import { AuthService as auth } from "../services/auth.service";

/*
 * This guard attribute is to be used for pages that are only
 * accessible for logged-in users, e.g, profile pages.
 */
@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private user: UserService) {
  }

  canActivate(): boolean {
    if (this.user.isLoggedIn()) return true;

    if (auth.hasCookie('token')) {
      let token = auth.getCookie('token');
      this.user.fetchUserData(token).then(ok => {
        if (!ok) auth.deleteCookies('token');
      }).catch(error => auth.deleteCookies('token'));
    }
    return true;
  }
}
