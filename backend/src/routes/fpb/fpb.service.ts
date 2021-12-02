import { Injectable } from '@nestjs/common';
import * as fs from "fs/promises";
import { Observable, firstValueFrom } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { GraphDbModelService } from '../../shared-services/graphdb-model.service';
import { SparqlService } from '../../shared-services/sparql.service';
import { FpbMappingService } from './fpb-mapping.service';
import { SparqlResponse } from '@shared/interfaces/sparql/SparqlResponse';

@Injectable()
export class FpbService { 

	private static fpbUploadDirectory = "./temp/fpbjs/uploads"

	constructor(
		private modelService: GraphDbModelService,
		private fpbMappingService: FpbMappingService,
		private queryService: SparqlService) {}

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


	getAllProcesses(): Observable<Array<string>>{
		const queryString = `
		PREFIX VDI3682: <http://www.hsu-ifa.de/ontologies/VDI3682#>
		PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
		SELECT ?Process WHERE {
			?Process a VDI3682:Process.
		`;
		
		return this.queryService.query(queryString).pipe(
			map(data => data.results.bindings.map(results => results["Process"].value))
		);
	}

	getAllTechnicalResources(): Observable<Array<string>>{
		const queryString = `
		PREFIX VDI3682: <http://www.hsu-ifa.de/ontologies/VDI3682#>
		PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
		SELECT ?TR WHERE {
			?TR a VDI3682:TechnicalResource.
		}`;
		
		return this.queryService.query(queryString).pipe(
			map(data => data.results.bindings.map(results => results["TR"].value))
		);
	}

	getInputsAndOutputs(): Observable<Array<string>>{
		const queryString = `
		PREFIX VDI3682: <http://www.hsu-ifa.de/ontologies/VDI3682#>
		PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
		SELECT ?IoPoE WHERE {
		?IoPoE a ?x.
			VALUES ?x {VDI3682:Energy VDI3682:Product VDI3682:Information}
		}`;

		return this.queryService.query(queryString).pipe(
			map(data => data.results.bindings.map(results => results["IoPoE"].value))
		);
	}

	/**
	 * Gets all classes of the VDI 3682 ODP
	 * @returns A list of classes
	 */
	getAllClasses(): Observable<Array<string>> {
		// TODO: This is very similar to the "getAllClasses" of other ODPs -> Should be inside a base service
		const queryString = `
		PREFIX owl: <http://www.w3.org/2002/07/owl#>
		SELECT DISTINCT ?type WHERE {
			?type a owl:Class.
			FILTER(STRSTARTS(STR(?type), "http://www.hsu-ifa.de/ontologies/VDI3682#"))
		}`;
		
		const classes =  this.queryService.query(queryString).pipe(
			map(res => {
				return res.results.bindings.map(binding => binding["type"].value);
			}));
		
		return classes;
	}

}


export class FileUploadRequest {
	fileName: string; 
	repositoryName: string;
}