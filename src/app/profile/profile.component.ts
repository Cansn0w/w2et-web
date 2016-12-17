import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/src/cookie';

import { ModalDirective } from 'ng2-bootstrap/components/modal/modal.component';

import { UserService } from '../core/services/user.service';
import { AuthService } from '../core/services/auth.service';
import { AccountData, PasswordData } from '../core/services/user.service';

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
	accountdata: AccountData;
	passworddata: PasswordData;

	default_profile_img: string = 'assets/default_profile.png';

	constructor(private user: UserService,
	            private auth: AuthService,
	            private router: Router) {
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
					if (Cookie.check('token')) Cookie.delete('token');
					this.router.navigate(['/']);
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
		this.user.updateAccountData(data, (succ) => {
			if (succ) {
				this.hideEditModal();
				this.user.loadUserData(data);
				this.reset();
			}
			else {
				alert('Sorry, there is something wrong and your account cannot be updated')
			}
		})
	}

	submitPasswordChange(data: PasswordData): void {
		if (data.new_password1 != data.new_password2) {
			alert('Please make sure you have entered the same password');
			return;
		}

		this.user.changePassword(data, (succ) => {
			if (succ) this.hideEditModal();
			else alert('Sorry, there is something wrong and your password cannot be reset');
		})
	}

	jump(path: string): void {
		this.router.navigate([path]);
	}
}
