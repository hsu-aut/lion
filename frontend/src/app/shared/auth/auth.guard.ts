import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, tap } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivateChild, CanActivate {

    constructor(
        private router: Router,
        private authService: AuthService
    ) {}
    
    /**
     * same as canActivate
     */
    canActivateChild(): Observable<boolean> {
        return this.canActivate();
    }

    /**
     * gets signed in status from backend via AuthService.
     * redirects to login page if user is not authenticated.
     */
    canActivate(): Observable<boolean> {
        return this.authService.verifySingedInStatus().pipe(tap( (signedIn: boolean) => {
            // navigate to login if false
            if (!signedIn) { this.router.navigate(['']); }
        }));
    }

}

// TODO: this should be done with a "functional guard", such as

/*

export const authGuard = () => {
    const authService = inject(AuthService);
    const router = inject(Router);
  
    if (authService.verifySingedInStatus()) {
        return true;
    }
  
    return router.navigate(['']);
};

*/