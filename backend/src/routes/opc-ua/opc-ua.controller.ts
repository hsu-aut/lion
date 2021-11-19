import { Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors, Body , Res, Req} from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import * as fs from "fs";
import { Response } from 'express';
import { OpcUaService } from './opc-ua.service';
import { OpcUaClientCreator } from './opc-ua-client.service';
import { OpcUaMappingCreator } from './opc-ua-mapper.service';
import { SparqlService } from '../../shared-services/sparql.service' ;
// import { OpcNode } from './subcomponents/opc-mapping-element.component';


export class ServerInfo{
	endpointUrl: string;
	securityPolicy: string;
	messageSecurityMode: string;
	userName: string;
	password: string;
}

export class DataToMap{
	// nodesToMap: Array<OpcNode>
	serverInfo: ServerInfo
	serverIp: string
	opcPrefix: string
	repository: string // referenced, but not assigned
	opc: Opc
}

export class Opc{
	serverInfo: ServerInfo
	nodesToMap: Array<OpcNode>
}

export class OpcNode{
	uuid: string
	nodeClass: string
	nodeId: string
}

@Controller('/lion_BE/opc-ua')
export class OpcUaController {

	constructor(
		private opcuaService: OpcUaService ,
		private sparqlService: SparqlService) {}

	/* 
	 * crawl a server 
	*/
	@Post('/crawl-server')
	crawlServer(@Body() serverInfo: ServerInfo, @Res() response: Response): void {
		console.log('trying to crawl server.');
		this.opcuaService.connectAndCrawl(serverInfo, response);
		// connectAndCrawl();
		
		// let crawlResult;
	}

	@Post('/mappings') 
	updateMappings(@Body() dataToMap: DataToMap): void {
		console.log('Updating Mappings...');
		console.log('dataToMap:');
		console.log(dataToMap);

		console.log('nodesToMap:');
		console.log(dataToMap.opc.nodesToMap);
		// figure out where to put: function(req, res)
		// const repository = dataToMap.repository;

		const opcUaMapper = new OpcUaMappingCreator(dataToMap);
		const mapping = opcUaMapper.createMapping();

		console.log(`Mapping Query: ${mapping}`);
		this.sparqlService.update(mapping) ;

		// sparqlUpdate(mapping, repository) { }: .then(queryRes => {
		// 	res.status(200).json(queryRes);
		// }).catch(err => {
		// 	res.status(500).json(err);
		// })
	}

}

