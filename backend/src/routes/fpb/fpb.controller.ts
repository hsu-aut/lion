import { Body, Controller, Delete, Get, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable } from 'rxjs';
import { FileUploadRequest, FpbService } from './fpb.service';

@Controller("/lion_BE/fpb")
export class FpbController {

	constructor(private fpbService: FpbService) {}


	/**
	 * Get a list of all fpb-js files
	 */
	@Get()
	getAllFiles(): Promise<string[]> {
		try {
			return this.fpbService.getAllFiles();	
		} catch (error) {
			console.error(`Error while trying to get all files of directory '${FpbService.getFpbUploadDirectory()}'`, error);
		}
	}


	/**
	 * Upload a new fpb-js file
	 * @param file A file which has been exported from fpb-js
	 */
	@Post()
	@UseInterceptors(FileInterceptor('file'))
	uploadFile(@UploadedFile() file: Express.Multer.File): Promise<void> {
		console.log("added new file");
		console.log(file);
		return;
	}

	@Put("rdf")
	async insertFpbToGraphDb(@Body() fileUploadRequest: FileUploadRequest): Promise<void> {
		return this.fpbService.insertFpbFileIntoGraphDB(fileUploadRequest);
		// const fileName = fileUploadRequest.fileName;
		// const activeGraph = 'http://' + parseFileName(fileName);
		// // const repositoryName = req.body.repositoryName;	// Now just inserted into the current repo

		// const ttlFileContent = fpbUtil.buildRDF(fileName);

		// GDB_GRAPH.ADD_TO_GRAPH(ttlFileContent, activeGraph, repositoryName).then(function (response) {

		// 	if (response.status == 204) {
		// 		console.log('Updated GDB with ' + 204);
		// 		res.status(200).json('Done!');
		// 	} else {
		// 		console.log(response.data);
		// 	}

		// })
		// 	.catch(function (error) {
		// 		res.status(500).json('Ups something went wrong with the GDB!');
		// 		console.log(error);
		// 	});
	}



	/**
	* Delete  all fpb-js files inside temp dir
	* 
	*/
	@Delete()
	deleteAllFiles(): Promise<void> {
		try {
			return this.fpbService.deleteAllFiles();	
		} catch (error) {
			console.error(`Error while trying to delete all files of directory '${FpbService.getFpbUploadDirectory()}'`, error);
		}
		
	}


	// TODO: Clear this mix between mapping and regular VDI3682 stuff (e.g. by sub-routes)
	@Get('/processes')
	getAllProcesses(): Observable<Array<string>> {
		return this.fpbService.getAllProcesses();
	}

	@Get('/technical-resources')
	getAllTechnicalResources(): Observable<Array<string>> {
		return this.fpbService.getAllTechnicalResources();
	}

	@Get('inputs-outputs')
	getInputsAndOutputs(): Observable<Array<string>> {
		return this.fpbService.getInputsAndOutputs();
	}

	@Get('classes')
	getAllClasses(): Observable<Array<string>> {
		return this.fpbService.getAllClasses();
	}

}
