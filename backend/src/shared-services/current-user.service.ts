import { Inject, Injectable, Scope } from '@nestjs/common';
import { User, UserDocument } from '../users/user.schema';
import { REQUEST } from '@nestjs/core';
import { Observable, catchError, from, take } from 'rxjs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoDbRequestException } from '../custom-exceptions/MongoDbRequestException';

@Injectable(
	{ scope: Scope.REQUEST }
)
export class CurrentUserService {

	constructor(
		@InjectModel(User.name) private userModel: Model<User>,
        @Inject(REQUEST) private request: Request,
	) {

	}

	getCurrentUser(): Observable<UserDocument> {
		const username: string = this.request['user']['username'];
		const foundUser: Promise<UserDocument> = this.userModel.findOne({ username: username }).exec();
		return from(foundUser).pipe(
			catchError(error => { 
				throw new MongoDbRequestException("error retrieving user: " + error.message);
			}),
			take(1)
		);
	}

}