import { Inject, Injectable, Scope } from '@nestjs/common';
import { User, UserDocument } from '../users/user.schema';
import { REQUEST } from '@nestjs/core';
import { Observable, catchError, from, take } from 'rxjs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoDbRequestException } from '../custom-exceptions/MongoDbRequestException';
import { Request } from 'express';
import { UsersService } from '../users/users.service';

@Injectable(
	{ scope: Scope.REQUEST }
)
export class CurrentUserService {

	constructor(
		@InjectModel(User.name) private userModel: Model<User>,
        @Inject(REQUEST) private request: Request,
		private userService: UsersService
	) {

	}

	getCurrentUser(): Observable<UserDocument> {
		const email: string = this.request['user']['email'];
		const foundUser: Promise<UserDocument> = this.userModel.findOne({ email: email }).exec();
		return from(foundUser).pipe(
			catchError(error => { 
				throw new MongoDbRequestException("error retrieving user: " + error.message);
			}),
			take(1)
		);
	}

}