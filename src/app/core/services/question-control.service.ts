import { Injectable }   from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { QuestionBase } from '../classes/form-questions';

@Injectable()
export class QuestionControlService {

  // Handy, already cooked form validation specs
  passwordVadSpec(): any {
    return {
      feedbacks: {
        required: 'password is required',
        minLength: 'Your password should be at least 8-character long',
        password: 'Your password should contain at least one upper and one lower case character'
      },
      constraints: { required: true, password: true, minLength: 8 }
    }
  }


  // CUSTOM VALIDATORS
  emailValidatorFn(control: FormControl): { [key: string]: any} {
    let emailRegex: RegExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return emailRegex.test(control.value) ? null : {
      'email': 'invalid'
    }
  }

  passwordValidator(control: FormControl): { [key: string]: any} {
    let passwordRegex: RegExp = new RegExp(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/);
    return passwordRegex.test(control.value) ? null : {
        'password': 'invalid'
      }
  }

  makeValidator(cnst?: { [name: string]: any }) {
    let validators = [];

    // Custom Validators
    if ('email' in cnst && cnst['email']) validators.push(this.emailValidatorFn);
    if ('password' in cnst && cnst['password']) validators.push(this.passwordValidator);

    // Ng2 Validators
    if ('required' in cnst && cnst['required']) validators.push(Validators.required);
    if ('minlength' in cnst) validators.push(Validators.minLength(cnst['minlength']));
    if ('maxlength' in cnst) validators.push(Validators.maxLength(cnst['maxlength']));
    if ('pattern' in cnst) validators.push(Validators.pattern(cnst['pattern']));

    return Validators.compose(validators);
  }

  toFormGroup(questions: QuestionBase<any>[]) {
    let group: any = {};

    questions.forEach((question: QuestionBase<any>) => {
      let validator = this.makeValidator(question.constraints);

      group[question.key] = validator
        ? new FormControl(question.value || '', validator)
        : new FormControl(question.value || '');
    });
    return new FormGroup(group);
  }
}
