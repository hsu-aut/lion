const uuid = require('uuid').v4;

module.exports = class OpcUaMappingCreator {

    constructor(dataToMap) {
        this.nodesToMap = dataToMap.nodesToMap;
        this.serverInfo = dataToMap.serverInfo;
        this.serverIp = this.serverInfo.endpointUrl; // this.serverInfo.endpointUrl.split('://')[1].split(':')[0];      // Get IP out of endpoint URL by cutting away protocol and port
        this.opcPrefix = 'OpcUa'
    }

    /**
     * Creates a mapping from a given OPC UA JSON
     */
    createMapping() {
        let queryString = `PREFIX ${this.opcPrefix}: <http://www.hsu-ifa.de/ontologies/OpcUa#>
        INSERT DATA{
            GRAPH <${this.serverIp}>{\n`;

        // Create description of server and nodeset
        const nodeSetId = `<urn:uuid:${uuid()}>`;
        queryString += this.createServerAndNodeSetDescription(nodeSetId);

        // Preprocessing, give every node a UUID
        // This is needed later when connecting with object properties
        this.nodesToMap.forEach(node => {
            node.uuid = uuid();
        })

        this.nodesToMap.forEach(node => {
            const keys = Object.keys(node);

            // create an individual for this node:
            const individualIri = `<urn:uuid:${node.uuid}>`;
            queryString += `${individualIri} rdf:type ${this.opcPrefix}:${this.getNodeType(node.nodeClass)};
            rdf:label '${node['browseName']}'.\n
            ${nodeSetId} ${this.opcPrefix}:containsNode ${individualIri}.`;

            keys.forEach(key => {
                if (Array.isArray(node[key])) {
                    queryString += this.createObjectProperty(individualIri, key, node); // add object properties
                } else {
                    if (key !== 'uuid') {
                        queryString += `${individualIri} ${this.opcPrefix}:${key} '${this.fixLiterals(node[key])}'.\n`; // add data properties
                    }
                }
            });
        });
        queryString += `}}`
        return queryString;
    }


    createObjectProperty(individualIri, property, node) {
        const referencedElements = node[property];      // Elements that are connected to node via a reference (which is key)
        let queryString = '';
        referencedElements.forEach(element => {
            queryString += `${individualIri} ${this.opcPrefix}:${property} <urn:uuid:${this.getNodeIriByNodeId(element.nodeId)}>.\n`;
        });
        return queryString;
    }


    /**
     * Fixes special chars such as line breaks
     * @param {string} literalWithSpecialChars The literal to fix
     */
    fixLiterals(literalWithSpecialChars) {
        const fixedLiteral = literalWithSpecialChars.replace(/[\r\n]+/gm, '');
        return fixedLiteral;
    }


    /**
     * Returns the OPC UA NodeClass name for a given nodeClassId
     * @param {string} nodeClassId 
     */
    getNodeType(nodeClassId) {
        switch (nodeClassId) {
            case 1:
                return 'UAObject';
            case 2:
                return 'UAVariable';
            case 4:
                return 'UAMethod';
            case 8:
                return 'UAObjectType';
            case 16:
                return 'UAVariableType';
            case 32:
                return 'UAReferenceType';
            case 64:
                return 'UADataType';
            case 128:
                return 'UAView';
            default:
                return 'UANode';    // If a wrong number is given, just return unspecific UANode
        }
    }

    /**
     * Creates a description for the server and the nodeset 
     * @param {string} nodeSetId ID of the nodeset to create. Has to be passed because it's needed when creating the individual nodes
     */
    createServerAndNodeSetDescription(nodeSetId) {
        const serverId = `<urn:uuid:${uuid()}>`;
        let queryString = `${serverId} rdf:type ${this.opcPrefix}:UAServer;
            rdf:label 'OPC-UA-Server_${this.serverInfo.endpointUrl}';
            ${this.opcPrefix}:hasMessageSecurityMode ${this.opcPrefix}:MessageSecurityMode_${this.serverInfo.messageSecurityMode};
            ${this.opcPrefix}:hasSecurityPolicy ${this.opcPrefix}:SecurityPolicy_${this.serverInfo.securityPolicy};
            ${this.opcPrefix}:requiresUserName '${this.serverInfo.username}';
            ${this.opcPrefix}:requiresPassword '${this.serverInfo.password}'.
            
        ${nodeSetId} rdf:type ${this.opcPrefix}:UANodeSet;
            rdf:label 'OPC-UA-Server_${this.serverInfo.endpointUrl}_NodeSet'.
        ${serverId} ${this.opcPrefix}:hasNodeSet ${nodeSetId}.`
        
        return queryString;
    }


    /**
     * IRIs for nodes have to have a UUID to make them unique. When mapping one server, is unique by its browseName.
     * After preprocessing the nodes 
     * @param {string} nodeId BrowseName to look for
     */
    getNodeIriByNodeId(nodeId) {
        const node = this.nodesToMap.find(node => node.nodeId === nodeId);
        return node.uuid;
    }
};