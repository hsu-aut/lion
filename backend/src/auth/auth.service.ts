import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignInResDto } from '@shared/models/auth/SignInResDto';
import { Observable} from 'rxjs';
import { CreateUserDto, User } from '../users/user.schema';
import * as bcrypt from 'bcrypt';
import { RepositoryService } from '../shared-services/repository.service';
import { SignUpReqDto } from '@shared/models/auth/SignUpReqDto';
import { SignInReqDto } from '@shared/models/auth/SignInReqDto';

@Injectable()
export class AuthService {

	constructor(
        private usersService: UsersService,
		private jwtService: JwtService,
		private repoService: RepositoryService
	) {}

	/**
	 * 
	 * @param signUpDto 
	 * @returns 
	 */
	async signUp(signUpDto: SignUpReqDto): Promise<SignInResDto> {
		// Check throws an error when something's not right
		await this.checkSignUpDto(signUpDto);
		
		const saltOrRounds = 10;
		const encryptedPassword = await bcrypt.hash(signUpDto.password, saltOrRounds);
		const createUserDto: CreateUserDto = {
			email: signUpDto.email,
			username: signUpDto.username,
			password: encryptedPassword,
		};
		
		// Add the user and create a default repository
		await this.usersService.addUser(createUserDto);
		
		console.log("creating repo");
		console.log(createUserDto.email);
		
		// creating repo
		this.repoService.createRepositoryForUser("default", createUserDto.email).subscribe(() => {
			console.log("created repo for new user");
			
		});
		return this.signIn(signUpDto as SignInReqDto);
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
			email: foundUser.email
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
	 * - verify email
	 * - pw policies
	 * @param signUpDto 
	 */
	async checkSignUpDto(signUpDto: SignUpReqDto): Promise<boolean> {
		const foundUser: User = await this.usersService.findUser(signUpDto.email);
		
		if(foundUser) {
			throw new BadRequestException(`User with name ${signUpDto.username} already exists`);
		} 

		return true;
	}

}