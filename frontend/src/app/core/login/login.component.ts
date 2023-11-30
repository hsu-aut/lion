import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../../router.animations';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SignInDtoReq } from '@shared/models/AuthDtos';
import { AuthService } from '../../shared/auth/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {

    public signInForm: FormGroup;

    constructor(
      public router: Router,
      private fb: FormBuilder,
      private authService: AuthService,
    ) {
        this.signInForm = this.fb.group({
            inputEmail: ['',Validators.required],
            inputPassword: ['',Validators.required]
        });
    }

    ngOnInit() {}

    /**
     * gets data from sign in form and calls AuthService to sign in user.
     */
    onLogin(): void {

        const formValues = this.signInForm.value;
        if (!formValues.inputEmail || !formValues.inputPassword) {
            // TODO call message service instead of console
            console.error("Login error, provide username and password");
            return;
        }

        const signinData: SignInDtoReq = {
            username: formValues.inputEmail,
            password: formValues.inputPassword
        };

        this.authService.signIn(signinData).subscribe( (signedIn: boolean) => {
            if (!signedIn) {
                this.signInForm.reset();
                // TODO call message service instead of console
                console.error("Login error, username and/or password incorrect");
            }
            this.router.navigate(['main']);
        });
        
        return;

    }

}
