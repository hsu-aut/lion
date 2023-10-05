import { HttpException, HttpStatus } from "@nestjs/common";

export class MongoDbRequestException extends HttpException {
	constructor(mongoDbErrorMessage?: string, mongoDbErrorCode?: number) {
		const errMsg = {
			title: "MongoDbRequestException", 
			message: mongoDbErrorMessage,
			code: mongoDbErrorCode
		};
		super(errMsg, HttpStatus.INTERNAL_SERVER_ERROR);
	}
}