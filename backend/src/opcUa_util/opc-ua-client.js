const OPCUAClient = require("node-opcua").OPCUAClient;
const MessageSecurityMode = require("node-opcua").MessageSecurityMode;
const SecurityPolicy = require("node-opcua").SecurityPolicy;
const UserTokenType = require("node-opcua").UserTokenType;

const connectionStrategy = {
	initialDelay: 1000,
	maxRetry: 1
};

class OpcUaClientCreator {

	constructor(serverInfo) {
		this.options = {
			applicationName: "Lion OPC UA Node-Crawler",
			connectionStrategy: connectionStrategy,
			securityMode: MessageSecurityMode[serverInfo.MessageSecurityMode],
			securityPolicy: SecurityPolicy[serverInfo.securityPolicy],
			endpoint_must_exist: false,
		};
    
		// User identityToken has to be used for secure access
		this.userIdentityToken = {
			password: serverInfo.password,
			userName: serverInfo.userName,
			type: UserTokenType.UserName
		};
	}

	/**
     * @returns OPCUAClient A fresh client instance
     */
	async createClient() {
		return await OPCUAClient.create(this.options);
	}

}

module.exports = OpcUaClientCreator;