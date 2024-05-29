import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SignInReqDto, SignUpReqDto } from '@shared/models/auth/SignInReqDto';
import { SignInResDto } from '@shared/models/auth/SignInResDto';
import { Observable, catchError, map, of } from "rxjs";
import { MessagesService } from "../services/messages.service";

@Injectable()
export class AuthService {

    constructor(
        private http: HttpClient,
        private messageService: MessagesService
    ) { }

    signUp(signUpData: SignUpReqDto): Observable<boolean> {
        return this.http.post<SignInResDto>('/lion_BE/auth/signup', signUpData).pipe(
            // on success: save access token in local app storage
            map( (response: SignInResDto) => {
                localStorage.setItem('access_token', response.access_token);
                return true;
            }),
            // on errors: return false
            catchError( (error: Error) => {
                if ((error instanceof HttpErrorResponse)) {
                    this.messageService.danger("Error while signing up", error.error.message);
                } else {
                    this.messageService.danger("Error while signing up", "Unknown error");
                }
                return of(false);
            }));
    }

    /**
     * signs in user by calling backend.
     * if user was signed in correctly, the jwt from the answer is stored it in local app storage for later use.
     * @param signInData the sign in data
     * @returns true if sign in sucessfull, false if not. catches 401/403 errors and returns false.
     */
    signIn(signInData: SignInReqDto): Observable<boolean> {
        return this.http.post<SignInResDto>('/lion_BE/auth/signin', signInData).pipe(
            // on success: save access token in local app storage
            map( (response: SignInResDto) => {
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
            })
        );
    }

    /**
     * signs out user by deleting the access token
     * TODO: should this call any action in the backend?
     */
    signOut(): void {
        localStorage.removeItem('access_token');
        return;
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
