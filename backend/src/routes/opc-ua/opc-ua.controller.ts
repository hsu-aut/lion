import { Controller, Post, Body , Res} from '@nestjs/common';
import { Response } from 'express';
import { OpcUaService } from './opc-ua.service';
import { OpcUaMappingCreator } from './opc-ua-mapper.service';
import { SparqlService } from '../../shared-services/sparql.service' ;



export class ServerInfo{
	endpointUrl: string;
	securityPolicy: string;
	messageSecurityMode: string;
	userName: string;
	password: string;
}

export class DataToMap{
	// nodesToMap: Array<OpcNode>
	// serverInfo: ServerInfo
	// serverIp: string
	// opcPrefix: string
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
	}

	@Post('/mappings') 
	updateMappings(@Body() dataToMap: DataToMap): void {
		console.log('Updating Mappings...');
		console.log('dataToMap:');
		console.log(dataToMap);

		// console.log('opc:');
		// console.log(dataToMap.opc);

		// console.log('nodesToMap:');
		// console.log(dataToMap.opc.nodesToMap);

		// console.log('ServerInfo:');
		// console.log(dataToMap.opc.serverInfo);


		const opcUaMapper = new OpcUaMappingCreator(dataToMap);
		const mapping = opcUaMapper.createMapping();

		console.log(`Mapping Query: ${mapping}`);
		this.sparqlService.update(mapping) ;

	}

}

