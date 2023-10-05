import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User, UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDtoReq, SignInDtoRes }  from '@shared/models/SignInDto';
import { Observable, from, map, mergeMap } from 'rxjs';

@Injectable()
export class AuthService {

	constructor(
        private usersService: UsersService,
		private jwtService: JwtService
	) {}

	/**
	 * checks username and password and returns a valid jwt token 
	 * @param signInDto the sign in data
	 * @returns a jwt token if sign in data is valid
	 */
	signIn(signInDto: SignInDtoReq): Observable<SignInDtoRes> {
		// use mergeMap to avoid inner observable
		return this.usersService.findUser(signInDto.username).pipe(mergeMap( (user: User | undefined) => {
			// throw unauthorized exception 
			// if user is undefined, i.e. does not exist
			// or password is not correct 
			if (user===undefined || !this.checkPassword(signInDto.password, user?.password)) {
				throw new UnauthorizedException();
			}
			// create payload for jwt
			const payload = { 
				username: user.username, 
				sub: user.userId 
			};
			// create jwt string as observable
			const jwtStringObs: Observable<string> = from(this.jwtService.signAsync(payload));
			// return sign in data as observable mapped from jwt string observable
			return jwtStringObs.pipe(map( (jwtString: string) => {
				return {access_token: jwtString};
			}));
		}));
	}

	/**
	 * TBD - function to return new jwt upon verify request
	 */
	refreshToken(): Observable<SignInDtoRes> {
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

}