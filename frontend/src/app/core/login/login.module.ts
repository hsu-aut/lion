import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { AuthService } from '../../shared/auth/auth.service';
import { SignInComponent } from './signin/signin.component';
import { SignUpComponent } from './signup/signup.component';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        LoginRoutingModule,
        ReactiveFormsModule
    ],
    providers: [
        AuthService,
    ],
    declarations: [
        LoginComponent,
        SignInComponent,
        SignUpComponent
    ]
})
export class LoginModule {}
