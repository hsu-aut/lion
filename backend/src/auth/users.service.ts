import { Injectable } from '@nestjs/common';
import { Observable, of } from 'rxjs';

@Injectable()
export class UsersService {

	private readonly users: Array<User> = [
		{
			userId: 1,
			username: 'u1',
			password: 'u1',
		},
		{
			userId: 2,
			username: 'u2',
			password: 'u2',
		},
	];

	/**
	 * TODO this should query a database with actual users
	 * should return null or undefined, if user does not exist
	 * creates a dummy observable for now
	 * @param username
	 * @returns 
	 */
	findUser(username: string): Observable<User|undefined> {
		const foundUser: User = this.users.find(user => user.username === username);
		return of(foundUser);
	}

}

export interface User {
	userId: number,
	username: string,
	password: string
}