import { Controller, Get, Post } from '@nestjs/common';

@Controller('/lion_BE/step')
export class StepController {
	constructor() {}

	/**
	 * Post a STEP file and store it locally
	 */
	@Post()
	uploadStepFile(): void {

	}
	

	/**
	 * Returns all files
	 */
	@Get()
	getAllFiles() {
		return {};
	}


	@Get('/json')
	getJsonOfFiles() {

	}
}
