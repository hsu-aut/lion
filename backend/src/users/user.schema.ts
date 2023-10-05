import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { GraphDbRepository, GraphDbRepositoryDocument, GraphDbRepositorySchema } from './user-data/graphdb-repository.schema';

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

    // @Prop({
    //     required: true 
    // })
    // email: string;

    // @Prop()
    // anyData: string;

    // // current graphdb repository
    // @Prop({ type: { type: mongoose.Schema.Types.ObjectId, ref: 'GraphDbRepository' } })
    // currentGraphDbRepository: GraphDbRepository;

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