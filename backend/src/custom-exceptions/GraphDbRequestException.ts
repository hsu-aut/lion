import { HttpException, HttpStatus } from "@nestjs/common";

export class GraphDbRequestException extends HttpException {
	constructor(graphDbErrorMessage?: string, graphDbErrorCode?: number) {
		const errMsg = {
			title: "GraphDbRequestException", 
			message: graphDbErrorMessage,
			code: graphDbErrorCode
		};
		super(errMsg, HttpStatus.INTERNAL_SERVER_ERROR);
	}
}