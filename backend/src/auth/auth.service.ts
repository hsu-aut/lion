import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignInReqDto } from '@shared/models/auth/SignInReqDto';
import { SignInResDto } from '@shared/models/auth/SignInResDto';
import { SignUpDto } from '@shared/models/auth/SignUpDto';
import { Observable} from 'rxjs';
import { CreateUserDto, User } from '../users/user.schema';
import * as bcrypt from 'bcrypt';
import { isNullOrUndefined } from 'node-opcua';

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
	async signUp(signUpDto: SignUpDto): Promise<SignInResDto> {
		// Check throws an error when something's not right
		await this.checkSignUpDto(signUpDto);
		
		const saltOrRounds = 10;
		const encryptedPassword = await bcrypt.hash(signUpDto.password, saltOrRounds);
		const createUserDto: CreateUserDto = {
			email: signUpDto.email,
			username: signUpDto.username,
			password: encryptedPassword,
		};
		
		await this.usersService.addUser(createUserDto);
		
		// After adding, sign user in
		const signInDto: SignInReqDto = {
			email: signUpDto.email,
			password: signUpDto.password
		};
		return this.signIn(signInDto);
	}

	/**
	 * checks username and password and returns a valid jwt token 
	 * @param signInDto the sign in data
	 * @returns a jwt token if sign in data is valid
	 */
	async signIn(signInDto: SignInReqDto): Promise<SignInResDto> {
		const foundUser: User = await this.usersService.findUser(signInDto.email);
		
		// throw unauthorized exception if user is null/undefined, i.e. does not exist or password is not correct
		const passwordCorrect = await this.checkPassword(signInDto.password, foundUser?.password);
		
		if ( foundUser === undefined || foundUser === null || !passwordCorrect) {
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
	async checkPassword(inputPassword: string, hashedPassword: string): Promise<boolean> {
		const passwordsMatch = bcrypt.compare(inputPassword, hashedPassword);
		return passwordsMatch;
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
	async checkSignUpDto(signUpDto: SignUpDto): Promise<boolean> {
		const foundUser: User = await this.usersService.findUser(signUpDto.email);
		console.log(foundUser);
		
		if(!isNullOrUndefined(foundUser)) {
			console.log("throwing");
			
			throw new BadRequestException(`User with name ${signUpDto.username} already exists`);
		} else {
			return true;
		}
	}

}