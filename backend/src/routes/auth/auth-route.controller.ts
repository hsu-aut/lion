import { Body, Controller, Post, Get } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import { SignInDtoReq, SignInDtoRes }  from '@shared/models/SignInDto';
import { Observable } from 'rxjs';
import { Public } from '../../auth/public.decorator';

@Controller("/lion_BE/auth")
export class AuthRouteController {

	constructor(
        private authService: AuthService
	) {}

	/**
	 * sign in route to get initial jwt
	 * @param signInDto the sign in data
	 * @returns 
	 */
	@Public()
	@Post("signin")
	signIn(@Body() signInDto: SignInDtoReq): Observable<SignInDtoRes> {
		return this.authService.signIn(signInDto);
	}

	/**
	 * route to verify that a user is signed in based on the jwt in the HTTP header
	 * TODO: instead of true return refresehd jwt token 
	 * @returns true if authenticated / 401 error if not 
	 */
	@Get("verify")
	verifySingedInStatus(): boolean {
		return true;
	}

}