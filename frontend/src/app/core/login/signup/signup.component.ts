import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { routerTransition } from '../../../router.animations';
import { AuthService } from '../../../shared/auth/auth.service';
import { MessagesService } from '../../../shared/services/messages.service';
import { SignUpReqDto } from '@shared/models/auth/SignUpReqDto';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
    animations: [routerTransition()]
})
export class SignUpComponent {

    public signUpForm: FormGroup;

    constructor(
        public router: Router,
        private fb: FormBuilder,
        private authService: AuthService,
        private messageService: MessagesService
    ) {
        this.signUpForm = this.fb.group({
            username: ['', Validators.required],
            inputEmail: ['', [Validators.required, Validators.email]],
            inputPassword: ['', [Validators.required, Validators.email]],
            inputPasswordConfirmation: ['', [Validators.required, Validators.email]],
        });
    }


    /**
     * gets data from sign in form and calls AuthService to sign in user.
     */
    signUp(): void {
        const formValues = this.signUpForm.value;
        if (!formValues.inputEmail || !formValues.inputPassword) {
            this.messageService.warn("Login error", "Please provide a username and password");
            return;
        }

        if (formValues.inputPassword != formValues.inputPasswordConfirmation) {
            this.messageService.warn("Login error", "Passwords don't match");
            return;
        }

        const signUpData: SignUpReqDto = {
            username: formValues.username,
            email: formValues.inputEmail,
            password: formValues.inputPassword,
            passwordConfirmation: formValues.inputPasswordConfirmation
        };

        this.authService.signUp(signUpData).subscribe({
            error: err => console.log(err),
            next: signedIn => {
                if (signedIn) this.router.navigate(['main']);
            },
        });

        return;

    }

}
