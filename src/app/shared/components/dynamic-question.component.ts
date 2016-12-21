import { Component, Input} from '@angular/core';
import { FormGroup } from '@angular/forms';

import { QuestionBase } from '../../core/classes/form-questions';

@Component({
	selector: 'df-question',
	template: `
		<div class="form-group"
				 [formGroup]="form">
		     
		  <label [attr.for]="question.key"> {{ question.label }} </label>
		  
	    <input class="form-control"
	           [formControlName]="question.key"
	           [id]="question.key"
	           [name]="question.key"
	           [placeholder]="question.key"
	           [type]="question.type">
	    <div *ngIf="isInvalidInput(question.key) && question.feedbacks"
	          class="alert alert-danger">
	      <div *ngFor="let problem of problems(question.key)">
	        {{question.feedbacks[problem]}}
				</div>
	    </div>
		</div>
	`
})
export class DynamicQuestionComponent {
	@Input() question: QuestionBase<any>;
	@Input() form: FormGroup;

	isInvalidInput(key: string): boolean {
		let control = this.form.controls[key];
		return control.errors && (control.touched || control.dirty);
	}

	problems(key: string): string[] {
		return Object.keys(this.form.controls[key].errors);
	}
}