import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessagesService } from '@shared-services/messages.service';
import { SetUserInfoDto } from '@shared/models/user/SetUserInfoDto';
import { UserService } from '../../../shared/services/backEnd/user.service';
import { UserInfoDto } from '../../../../../models/user/UserInfoDto';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

    constructor(
        private userService: UserService,
		private formBuilder: FormBuilder,
        private messageService: MessagesService
    ) { }

    username: string = null;

    userInfoForm = this.formBuilder.group({
        firstName: new FormControl("", [Validators.pattern('^[a-zA-Z]+$')]),
        lastName: new FormControl("", [Validators.pattern('^[a-zA-Z]+$')]),
    })

    ngOnInit(): void {
        this.getUserInfo();
    }

    getUserInfo(): void {
        this.userService.getCurrentUserInfo().subscribe({
            next: (userInfo: UserInfoDto) => {
                this.userInfoForm.setValue({
                    firstName: userInfo.firstName || "",
                    lastName: userInfo.lastName || "",
                });
                this.username = userInfo.username;
            },
            error: (error: Error) => {
                console.error('No user info retrieved' + error);
            },
            complete: () => { return; }
        });
    }

    updateInfo(): void {
        if(this.userInfoForm.valid) {
            const setuserInfoDto: SetUserInfoDto = {
                firstName: this.userInfoForm.get('firstName').value,
                lastName: this.userInfoForm.get('lastName').value,
            };
            this.userService.setCurrentUserInfo(setuserInfoDto).subscribe({
                next: () => {
                    this.messageService.success("Success", "New user info was set!");
                    this.getUserInfo();
                },
                error: (error: Error) => {
                    console.error('No user info set' + error);
                    this.messageService.warn("Error", "New user info was not set!");
                }
            });
        } else if (this.userInfoForm.invalid) {
            this.messageService.warn(
                "Invalid Form",
                (this.userInfoForm.get('firstName').valid ? "" : "[First Name] is not valid!")
                + (this.userInfoForm.get('lastName').valid ? "" : "[Last Name] is not valid!")
                + (this.userInfoForm.get('email').valid ? "" : "[E-Mail] is not valid!")
            );
            return null;
        }
    }

}
