import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { GraphDbRepository } from './user-data/graphdb-repository.schema';
import { UserInfo } from './user-data/user-info.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {

    @Prop({
        required: true, 
        unique: true
    })
    username: string;

    @Prop({
        required: true 
    })
    password: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'UserInfo' })
	userInfo: UserInfo;

	// graphdb repositories owned by the user
	@Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GraphDbRepository' }] })
	graphDbRepositories: GraphDbRepository[];

}

export const UserSchema = SchemaFactory.createForClass(User);

export interface CreateUserDto {
    username: string,
    password: string,
    email: string
}