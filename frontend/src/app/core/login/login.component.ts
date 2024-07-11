import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../../router.animations';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SignInReqDto } from '@shared/models/auth/SignInReqDto';
import { AuthService } from '../../shared/auth/auth.service';
import { MessagesService } from '../../shared/services/messages.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent {

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

    ngOnInit(): void {
        this.authService.verifySingedInStatus().subscribe(verified => {
            if(verified) {
                this.router.navigate(['main']);
            }
        });

    }

}
