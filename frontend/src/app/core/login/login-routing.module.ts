import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login.component';
import { SignInComponent } from './signin/signin.component';
import { SignUpComponent } from './signup/signup.component';

const routes: Routes = [
    { path: '', component: LoginComponent,
        children: [{
            path: '',
            redirectTo: 'sign-in',
            pathMatch: 'full'
        },
        {
            path: 'sign-in',
            component: SignInComponent
        },
        {
            path: 'sign-up',
            component: SignUpComponent
        }]
    },
    { path: 'main', redirectTo: 'main' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LoginRoutingModule {}
