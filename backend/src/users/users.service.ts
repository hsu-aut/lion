import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { CreateUserDto } from './user.schema';

@Injectable()
export class UsersService {

	constructor(
        @InjectModel(User.name) private userModel: Model<User>
	) {

	}

	async addUser(createUserDto: CreateUserDto): Promise<void> {
		const createdUser = new this.userModel(createUserDto);
		await createdUser.save();
		return;
	}

	async findUser(email: string): Promise<User> {
		return this.userModel.findOne({ email: email }).exec();
	}

	async findAll(): Promise<User[]> {
		return this.userModel.find().exec();
	}

}