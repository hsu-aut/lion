import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

//
export type UserInfoDocument = HydratedDocument<UserInfo>;

@Schema()
export class UserInfo {

    @Prop()
    firstName: string;

    @Prop()
    lastName: string;

    @Prop()
    email: string;

}

//
export const UserInfoSchema = SchemaFactory.createForClass(UserInfo);