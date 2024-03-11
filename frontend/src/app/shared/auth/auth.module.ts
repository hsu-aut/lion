import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { AuthInterceptor } from './auth.interceptor';
import { AuthGuard } from './auth.guard';

@NgModule({
    imports: [CommonModule],
    declarations: [
    ],
    providers: [
        AuthService,
        AuthGuard,
        AuthInterceptor
    ],
    exports: []
})
export class AuthModule {}
