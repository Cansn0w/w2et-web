import { QuestionSpec } from '../types';

export class QuestionBase<T> implements QuestionSpec<T>{
	value?: T;
	key?: string;
	label?: string;
	controlType?: string;
	type?: string;
	feedbacks?: { [name: string]: any };
	constraints?: { [name: string]: any };

	constructor(options: QuestionSpec<T>) {
		this.value = options.value;
		this.key = options.key || '';
		this.label = options.label || '';
		this.type = options.type || '';
		this.controlType = options.controlType || '';
		this.feedbacks = options.feedbacks || {};
		this.constraints = options.constraints || {};
	}
}

export class TextboxQuestion extends QuestionBase<string> {
	controlType = 'textbox';
	type: string;

	constructor(options: QuestionSpec<string>) {
		super(options);
		this.type = options['type'] || '';
	}
}
