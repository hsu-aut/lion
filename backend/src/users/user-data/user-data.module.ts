import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphDbRepository, GraphDbRepositorySchema } from './graphdb-repository.schema';
import { UserInfo, UserInfoSchema } from './user-info.schema';

@Module({
	imports: [MongooseModule.forFeature([
		{ name: GraphDbRepository.name, schema: GraphDbRepositorySchema },
		{ name: UserInfo.name, schema: UserInfoSchema }
		])],
	providers: [],
	exports: [MongooseModule],
	})
export class UserDataModule {}