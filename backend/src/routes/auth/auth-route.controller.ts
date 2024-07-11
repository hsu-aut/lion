import { Body, Controller, Post, Get } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import { SignInReqDto } from '@shared/models/auth/SignInReqDto';
import { SignInResDto } from '@shared/models/auth/SignInResDto';
import { Public } from '../../auth/public.decorator';
import { SignUpReqDto } from '@shared/models/auth/SignUpReqDto';

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
	signUp(@Body() signUpDto: SignUpReqDto): Promise<SignInResDto> {
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