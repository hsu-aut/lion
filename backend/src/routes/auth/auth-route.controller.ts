import { Body, Controller, Post, Get } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import { SignInReqDto } from '@shared/models/auth/signInReqDto';
import { SignInResDto } from '@shared/models/auth/signInResDto';
import { SignUpDto } from '@shared/models/auth/signUpDto';
import { Observable } from 'rxjs';
import { Public } from '../../auth/public.decorator';
import { User } from '../../users/user.schema';

@Controller("/lion_BE/auth")
export class AuthRouteController {

	constructor(
        private authService: AuthService
	) {

	}

	/**
	 * sign up route to create user
	 * @param signInDto
	 * @returns 
	 */
	@Public()
	@Post('signUp')
	signUp(@Body() signUpDto: SignUpDto): Promise<void> {
		return this.authService.signUp(signUpDto);
	}

	/**
	 * sign in route to get initial jwt
	 * @param signInDto the sign in data
	 * @returns 
	 */
	@Public()
	@Post('signIn')
	async signIn(@Body() signInDto: SignInReqDto): Promise<SignInResDto> {
		return this.authService.signIn(signInDto);
	}

	/**
	 * route to verify that a user is signed in based on the jwt in the HTTP header
	 * TODO: instead of true return refresehd jwt token 
	 * @returns true if authenticated / 401 error if not 
	 */
	@Get('verify')
	verifySingedInStatus(): boolean {
		return true;
	}

}