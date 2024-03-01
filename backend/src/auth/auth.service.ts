import { ImATeapotException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignInReqDto } from '@shared/models/auth/SignInReqDto';
import { SignInResDto } from '@shared/models/auth/SignInResDto';
import { SignUpDto } from '@shared/models/auth/SignUpDto';
import { Observable, of } from 'rxjs';
import { CreateUserDto, User } from '../users/user.schema';

@Injectable()
export class AuthService {

	constructor(
        private usersService: UsersService,
		private jwtService: JwtService
	) {}

	/**
	 * 
	 * @param signUpDto 
	 * @returns 
	 */
	signUp(signUpDto: SignUpDto): Promise<void> {
		if (!(this.checkSignUpDto(signUpDto))) {
			// throw new BadRequestException();
			throw new ImATeapotException();
		}
		const encryptedPassword: string = signUpDto.password;
		const createUserDto: CreateUserDto = {
			username: signUpDto.username,
			password: encryptedPassword,
			email: signUpDto.email
		};
		return this.usersService.addUser(createUserDto);
	}

	/**
	 * checks username and password and returns a valid jwt token 
	 * @param signInDto the sign in data
	 * @returns a jwt token if sign in data is valid
	 */
	async signIn(signInDto: SignInReqDto): Promise<SignInResDto> {
		const foundUser: User = await this.usersService.findUser(signInDto.username);
		// throw unauthorized exception 
		// if user is null/undefined, i.e. does not exist
		// or password is not correct 
		if ( foundUser === undefined || foundUser === null || !this.checkPassword(signInDto.password, foundUser?.password)) {
			throw new UnauthorizedException();
		}
		// create payload for jwt
		const payload = { 
			username: foundUser.username 
		};
		const jwtString: string = await this.jwtService.signAsync(payload);
		return {access_token: jwtString};
	}

	/**
	 * TBD - function to return new jwt upon verify request
	 */
	refreshToken(): Observable<SignInResDto> {
		return null;
	} 
	
	/**
	 * this should actually compare a hashed password and the input password
	 * @param inputPassword incoming, unhashed password
	 * @param hashedPassword hashed password from database 
	 * @returns
	 */
	checkPassword(inputPassword: string, hashedPassword: string): boolean {
		if (inputPassword === hashedPassword) {
			return true;
		}
		return false;
	}

	/**
	 * dummy, returns Observable<true> for now
	 * TODO: implement this
	 * check stuff:
	 * - username not taken
	 * - verify email
	 * - pw policies
	 * @param signUpDto 
	 */
	checkSignUpDto(signUpDto: SignUpDto): Observable<boolean> {
		return of(true);
	}

}