import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CallbackWithoutResultAndOptionalError, HydratedDocument, Model } from 'mongoose';
import { User, UserDocument, UserSchema } from '../user.schema';

//
export type GraphDbRepositoryDocument = HydratedDocument<GraphDbRepository>;

@Schema()
export class GraphDbRepository {

    @Prop({
        required: true
    })
    name: string;

    @Prop({
        required: true,
        default: "not initiated"
    })
    uri: string;

    @Prop({
        required: true,
        default: false
    })
    workingDirectory: boolean;

}

//
export const GraphDbRepositorySchema = SchemaFactory.createForClass(GraphDbRepository);

/*
this middleware hook assures, that whenever a repository (a repository document) is deleted,
the references within any user document are deleted, too
{ document: true, query: false } is used to refer to the document hook not query hook
-> https://github.com/Automattic/mongoose/issues/8555
*/ 
GraphDbRepositorySchema.pre(
	'deleteOne', 
	{ document: true, query: false }, 
	async function (next: CallbackWithoutResultAndOptionalError) {
		const model: Model<User> = this.$model<Model<User>>('User');
		await model.updateMany(
			{ }, 
			{ $pull: { graphDbRepositories: this._id }	},
			{ multi: true}
		).exec();
		next();
	}
);