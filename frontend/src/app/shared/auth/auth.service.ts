import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SignInDtoReq, SignInDtoRes } from "@shared/models/AuthDtos";
import { Observable, catchError, firstValueFrom, map, of, take } from "rxjs";

@Injectable()
export class AuthService {
     
    constructor(
        private http: HttpClient
    ) { }
    
    /**
     * signs in user by calling backend.
     * if user was signed in correctly, the jwt from the answer is stored it in local app storage for later use.
     * @param signInData the sign in data
     * @returns true if sign in sucessfull, false if not. catches 401/403 errors and returns false.
     */
    signIn(signInData: SignInDtoReq): Observable<boolean> {
        return this.http.post<SignInDtoRes>('/lion_BE/auth/signin', signInData).pipe(
            // on success: save access token in local app storage
            map( (response: SignInDtoRes) => {
                localStorage.setItem('access_token', response.access_token);
                return true;
            }),
            // on errors: return false
            catchError( (error: Error) => {
                if ((error instanceof HttpErrorResponse) && (error.status == 401 || error.status == 403)) {
                    // TODO call message service instead of console
                    console.error("Login error, username and/or password incorrect");
                }
                return of(false);
            }));
    }

    /**
     * check if user is signed in.
     * if user is signed in, the refreshed jwt from the answer is stored it in local app storage for later use.
     * @returns true if verified, false if not. catches 401/403 errors and returns false.
     */
    verifySingedInStatus(): Observable<boolean> {
        return this.http.get<boolean>('/lion_BE/auth/verify').pipe(
            // TODO
            // on success: store new access token in local app storage, return true
            // for now, just forward
            map( (response: boolean) => {
                // localStorage.setItem('access_token', response.access_token);
                return response;
            }),
            // on errors: return false
            catchError( (error: Error) => {
                if ((error instanceof HttpErrorResponse) && (error.status == 401 || error.status == 403)) {
                    // TODO call message service instead of console
                    console.error("not signed in");
                }
                return of(false);
            })
        );
    }

}
