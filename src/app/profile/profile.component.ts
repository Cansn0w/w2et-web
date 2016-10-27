import {Component, OnInit, ViewChild, ChangeDetectionStrategy} from '@angular/core';
import {Cookie} from 'ng2-cookies/src/cookie';

import {ModalDirective} from 'ng2-bootstrap/components/modal/modal.component';

import {UserService} from '../com/user.service'

@Component({
	selector: 'app-profile',
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './templates/profile.html',
})
export class ProfileComponent implements OnInit {

	@ViewChild('editModal') public editModal: ModalDirective;


	constructor(private user: UserService) {
	}

	ngOnInit() {
	}

	logOut(): void {
		this.user.reset();
		if (Cookie.check('token')) Cookie.delete('token');
	}

	showEditModal(): void {
		this.editModal.show();
	}

	hideEditModal(): void {
		this.editModal.hide();
	}

	get email() {
		return this.user.getEmail();
	}

	get username() {
		return this.user.getUsername();
	}

}
