import { Injectable } from '@angular/core';

@Injectable()
export class UserService {
  private _loggedIn: boolean = false;
  private _email: string;

  login(email: string, password: string): boolean {
    this._email = email;
    this._loggedIn = true;
    return true;
  }

  isLoggedIn(): boolean {
    return this._loggedIn;
  }

  getEmail() {
    return this._email;
  }

}
