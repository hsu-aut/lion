import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { User, UserSchema } from './user.schema';
import { UserDataModule } from './user-data/user-data.module';

@Module({
	imports: [
	MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
	UserDataModule
	],
	providers: [
	UsersService
	],
	exports: [
	UsersService,
	MongooseModule,
	UserDataModule
	],
	})
export class UsersModule {}