import { Injectable } from '@nestjs/common';
import * as fs from "fs/promises";
import { GraphDbModelService } from '../../shared-services/graphdb-model/graphdb-model.service';
import { FpbMappingService } from './fpb-mapping.service';
import { FileUploadRequest } from './fpb.controller';

@Injectable()
export class FpbService { 

	private static fpbUploadDirectory = "./temp/fpbjs/uploads"

	constructor(
		private modelService: GraphDbModelService,
		private fpbMappingService: FpbMappingService) {}

	static getFpbUploadDirectory(): string {
		return this.fpbUploadDirectory;
	}

	/**
	 * Get all fpb-js files that are currently inside the temp dir
	 * @returns A list of file names
	 */
	async getAllFiles(): Promise<string[]> {
		const fileNames = fs.readdir(FpbService.getFpbUploadDirectory());
		return fileNames;
	}

	async deleteAllFiles(): Promise<void> {
		return fs.rmdir(FpbService.getFpbUploadDirectory(), { recursive: true });
	}


	async insertFpbFileIntoGraphDB(fileUploadRequest: FileUploadRequest) {
		const fileName = fileUploadRequest.fileName;
		const activeGraph = 'http://' + this.parseFileName(fileName);
		// const repositoryName = req.body.repositoryName;	// Now just inserted into the current repo

		const uploadDir = FpbService.getFpbUploadDirectory();
		
		const jsonFilePath = uploadDir + '/' + fileName;

		try {
			// Read the fpb file, parse to JSON and use the mapper to map it to RDF
			const fpbjs = (await fs.readFile(jsonFilePath)).toJSON();
			const processRdf = this.fpbMappingService.mapJsonToRDF(fpbjs);
			// Insert rdf into ontology
			this.modelService.addTurtleFileToGraph(processRdf, activeGraph);
		} catch (error) {
			console.error(error);
		}

	}



	/**
	 * Removes whitespaces and slashes from file name in order to get valid IRI
	 * @param fileName file name that might contain problematic characters
	 * @returns A string without spaces and slashes
	 */
	parseFileName(fileName: string): string {
		const newFileName = fileName.replace(/ /g, "_").replace(/\\/g, "_");
		return newFileName;
	}

}
