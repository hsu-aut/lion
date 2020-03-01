module.exports = class OpcUaMappingCreator {
    
    constructor(nodesToMap) {
        this.nodesToMap = nodesToMap;
        this.opcPrefix = "OPCUA"
        this.currentPrefix = ""
    }

    /**
     * Creates a mapping from a given OPC UA JSON
     */
    createMapping() {
        // TODO: Currently setting only the simple type "Node"
        // --> We have to differ between different types of nodes (e.g. Method, Variable, ...)
        // --> Node types can be differentiated by checking the NodeClass. Currently only the nodeClass od the root node is in the parsed model.
        // --> It's a problem with the parser
        let queryString = "";
        this.nodesToMap.forEach(node => {
            const keys = Object.keys(node);
            // create an individual for this node:
            queryString += `${currentNamespace}:${node["browseName"]} rdf:type ${this.opcPrefix}:node.\n`;

            keys.forEach(key => {
                if (Array.isArray(node[key])) {
                    queryString += this.createObjectProperty(key, node); // add object properties
                } else {
                    queryString += `${currentNamespace}:${node["browseName"]} ${this.opcPrefix}:${key} "${node[key]}".\n`; // add data properties
                }
            });
        });
        return queryString;
    }


    createObjectProperty(key, node){
        const array = node[key];
        let queryString = '';
        array.forEach(element => {
            // if(this.isInNodesToMap(element)){
                queryString += `${this.currentPrefix}:${node["browseName"]} ${this.opcPrefix}:${key} ${this.currentPrefix}:${element["browseName"]}.\n`;
            // }
        });
        return queryString;
    }
};