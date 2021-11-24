import { Injectable } from '@nestjs/common';
import { OPCUAClient, MessageSecurityMode, SecurityPolicy, UserTokenType } from 'node-opcua';
import { ServerInfo } from './opc-ua.controller';

const connectionStrategy = {
	initialDelay: 1000,
	maxRetry: 1
};

export class UserIdentityToken{
	password: string
	userName: string
	type: number
}


@Injectable()
export class OpcUaClientCreator {

	private options: unknown;
	private userIdentityToken: UserIdentityToken;

	constructor(serverInfo: ServerInfo) {
		this.options = {
			applicationName: 'Lion OPC UA Node-Crawler',
			connectionStrategy: connectionStrategy,
			securityMode: MessageSecurityMode[serverInfo.messageSecurityMode],
			securityPolicy: SecurityPolicy[serverInfo.securityPolicy],
			endpointMustExist: false,
		};

		// User identityToken has to be used for secure access
		this.userIdentityToken = {
			password: serverInfo.password,
			userName: serverInfo.userName,
			type: UserTokenType.UserName
		};
	}
	async createClient(): Promise<OPCUAClient> {
		return OPCUAClient.create(this.options);
	}
}