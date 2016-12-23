import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { QuestionBase, TextboxQuestion } from '../core/classes/form-questions';

import { UserService } from '../core/services/user.service';
import { QuestionControlService } from "../core/services/question-control.service";
import { AuthService } from '../core/services/auth.service';
import { AccountData, PasswordData } from '../core/services/user.service';

import { ModalDirective } from 'ng2-bootstrap/modal/modal.component';
import { FormGroup } from "@angular/forms";

/*
 * Profile Component:
 * Manages displaying user information as well as updating user profile
 */
@Component({
  selector: 'app-profile',
  templateUrl: './templates/profile.html',
})
export class ProfileComponent implements OnInit {

  @ViewChild('editModal') public editModal: ModalDirective;
  defaultProfileImg: string = 'assets/default_profile.png';

  accountdata: AccountData;
  passworddata: PasswordData;
  accountForm: FormGroup;
  passwordForm: FormGroup;

  accountFormQuestions: QuestionBase<string>[] = [
    new TextboxQuestion({
      key: 'username',
      label: 'Username',
      type: 'text',
      feedbacks: { required: 'username is required'},
      constraints: { required: true }
    }),
    new TextboxQuestion({
      key: 'image',
      label: 'Image',
      type: 'url',
      feedbacks: { required: 'please specify your profile image url'},
      constraints: { required: true }
    }),
  ];

  passwordFormQuestions: QuestionBase<string>[] = [
    new TextboxQuestion(Object.assign({
      key: 'oldpassword',
      label: 'Old Password',
      type: 'password'
    }, this.qControlService.passwordVadSpec())),
    new TextboxQuestion(Object.assign({
      key: 'new_password1',
      label: 'New Password',
      type: 'password'
    }, this.qControlService.passwordVadSpec())),
    new TextboxQuestion({
      key: 'new_password2',
      label: 'Confirm Password',
      type: 'password',
      feedbacks: { required: 'please re-enter your new password' },
      constraints: { required: true }
    }),
  ];

  constructor(
    private user: UserService,
    private qControlService: QuestionControlService,
    private auth: AuthService,
    private router: Router
  ) {
    this.accountForm = this.qControlService.toFormGroup(this.accountFormQuestions);
    this.passwordForm = this.qControlService.toFormGroup(this.passwordFormQuestions);
  }

  ngOnInit() {
    this.reset();
  }

  reset(): void {
    this.accountdata = {
      username: this.user.getUsername(),
      image: this.user.getImage(),
      email: this.user.getEmail()
    };
    this.passworddata = {
      oldpassword: null,
      new_password1: null,
      new_password2: null
    };
  }

  logOut(): void {
    this.auth.logout(this.user.getToken())
      .then(response => {
        if ('success' in response) {
          this.user.reset();
          this.router.navigate(['/']);
          AuthService.deleteCookies()
        }
      });
  }

  showEditModal(): void {
    this.editModal.show();
  }

  hideEditModal(): void {
    this.editModal.hide();
  }

  submitAccountUpdate(data: AccountData): void {
    this.user.updateAccountData(data).then(ok => {
        if (ok) {
          this.hideEditModal();
          this.user.setUserData(data);
          this.reset();
        } else {
          alert('Sorry, there is something wrong and your account cannot be updated')
        }
      });
  }

  submitPasswordChange(data: PasswordData): void {
    if (data.new_password1 != data.new_password2) {
      alert('Please make sure you have entered the same password');
      return;
    }

    this.user.changePassword(data).then(ok => {
        if (ok) this.hideEditModal();
        else alert('Sorry, there is something wrong and your password cannot be reset');
      });
  }

  jump(path: string): void {
    this.router.navigate([path]);
  }
}
