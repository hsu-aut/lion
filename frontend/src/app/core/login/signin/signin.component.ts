import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SignInReqDto } from '@shared/models/auth/SignInReqDto';
import { routerTransition } from '../../../router.animations';
import { AuthService } from '../../../shared/auth/auth.service';
import { MessagesService } from '../../../shared/services/messages.service';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss'],
    animations: [routerTransition()]
})
export class SignInComponent {

    public signInForm: FormGroup;

    constructor(
        public router: Router,
        private fb: FormBuilder,
        private authService: AuthService,
        private messageService: MessagesService
    ) {
        this.signInForm = this.fb.group({
            inputEmail: ['', Validators.required],
            inputPassword: ['', Validators.required]
        });
    }


    /**
     * gets data from sign in form and calls AuthService to sign in user.
     */
    signIn(): void {
        const formValues = this.signInForm.value;

        if (!formValues.inputEmail || !formValues.inputPassword) {
            this.messageService.warn("Login error", "Please provide a username and password");
            return;
        }

        const signinData: SignInReqDto = {
            email: formValues.inputEmail,
            password: formValues.inputPassword
        };

        this.authService.signIn(signinData).subscribe((signedIn: boolean) => {
            if (!signedIn) {
                this.signInForm.reset();
                this.messageService.warn("Login error", "Incorrect user / password");
            }
            this.router.navigate(['main']);
        });

        return;

    }

}
