import { Injectable, Res } from '@nestjs/common';
import { Response } from 'express';
// import {  } from '@nestjs/platform-express';
import { NodeCrawler } from 'node-opcua';
import { OpcUaClientCreator} from './opc-ua-client.service';
import { ServerInfo } from './opc-ua.controller';
// import * as fs from "fs/promises";

@Injectable()
export class OpcUaService {
	async connectAndCrawl(serverInfo: ServerInfo, @Res() response: Response ): Promise<void> {
		const opcUaClientCreator = new OpcUaClientCreator(serverInfo);
		const opcUaClient = await opcUaClientCreator.createClient();
		await opcUaClient.connect(serverInfo.endpointUrl);
		const session = await opcUaClient.createSession();

		const nodeCrawler = new NodeCrawler(session);
		// console.log(session);
		nodeCrawler.read("RootFolder").then(crawlResult => {
			console.log(crawlResult);
			response.status(200).json(crawlResult); 
			// res.status(200).json(crawlResult);
		});
	}
}
