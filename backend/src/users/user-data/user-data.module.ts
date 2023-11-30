import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphDbRepository, GraphDbRepositorySchema } from './graphdb-repository.schema';

@Module({
	imports: [MongooseModule.forFeature([{ name: GraphDbRepository.name, schema: GraphDbRepositorySchema }])],
	providers: [],
	exports: [MongooseModule],
	})
export class UserDataModule {}