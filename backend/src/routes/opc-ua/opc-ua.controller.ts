import { Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors, Body } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import * as fs from "fs";
import { OpcUaService } from './opc-ua.service';

@Controller('/lion_BE/opc-ua')
export class OpcUaController {

	constructor(private opcuaService: OpcUaService) {}

    /* 
     * crawl a server 
    */
    @Post('/crawl-server')
	crawlServer(@Body() serverInfo: ServerInfo): void {
		console.log('trying to crawl server.');
        
		connectAndCrawl();

		let crawlResult;
		async function connectAndCrawl() {
			const opcUaClientCreator = new OpcUaClientCreator(serverInfo);
			const opcUaClient = await opcUaClientCreator.createClient();
			await opcUaClient.connect(serverInfo.endpointUrl);
			const session = await opcUaClient.createSession();
            
			const nodeCrawler = new NodeCrawler(session);
			nodeCrawler.read("RootFolder").then(crawlResult => {
				res.status(200).json(crawlResult);
			});
		}
	}

}

class ServerInfo{
    endpointUrl: string;
    securityPolicy: string;
    messageSecurityMode: string;
    username: string;
    password: string;
}

