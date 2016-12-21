/********* USER *********/
export interface QuestionSpec<T> {
	value?: T;
	key?: string;
	label?: string;
	type?: string;
	controlType?: string;
	feedbacks?: { [name: string]: string };
	constraints?: { [name: string]: any }; // expected keys: ['required', 'pattern', 'minlength', 'maxlength', 'email']
}


/********* USER *********/
export interface LoginCredential {
	email: string;
	password: string;
}

export interface SignupCredential {
	username: string;
	email: string;
	password1: string;
	password2: string;
}

/********* GOOGLEMAP *********/
export interface LngLat {
	lng: number;
	lat: number;
}

export interface Marker {
	lat: number;
	lng: number;
	label?: string;
	draggable?: boolean;
	addr?: string;
}
