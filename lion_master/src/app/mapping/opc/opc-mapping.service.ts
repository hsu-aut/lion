import { Injectable } from '@angular/core';
import { OpcNode } from './subcomponents/opc-mapping-element.component';

@Injectable({
  providedIn: 'root'
})
export class OpcMappingService {

constructor() {}

    nodesToMap = new Array<OpcNode>();

    /**
     * Adds one OPC UA node to the list of nodes to map into the ontology
     * @param node The node to add
     */
    addOpcNode(node: OpcNode) {
        // add node if not alreay part of nodesToMap
        if(!this.isInNodesToMap(node)){
            this.nodesToMap.push(node);
        }
    }


    /**
     * Adds all children of a node to nodesToMap
     * @param node
     */
    addAllChildren(node: OpcNode) {
        const keys = Object.keys(node);
        keys.forEach(key => {
            const currentElement = node[key]
            if (Array.isArray(currentElement)) {
                currentElement.forEach(elem => {
                    this.addOpcNode(elem);
                    this.addAllChildren(elem);
                });
            }
        });
    }


    /**
     * Removes one OPC UA node from the list of nodes to map into the ontology
     * @param id Id of the node to delete (This ID gets randomly generated)
     */
    removeOpcNode(node: OpcNode) {
        // Filter the list to get all elements that do not have the given ID
        this.nodesToMap = this.nodesToMap.filter(elem =>
            elem.mappingId != node.mappingId
        )
    }


    /**
     * Removes all children of a node from nodesToMap
     * @param node
     */
    removeAllChildren(node: {}) {
        const keys = Object.keys(node);
        keys.forEach(key => {
            const currentElement = node[key]
            if (Array.isArray(currentElement)) {
                currentElement.forEach(elem => {
                    this.removeOpcNode(elem);
                    this.removeAllChildren(elem);
                });
            }
        });
    }


    /**
     * Creates the mapping string for the complete list of nodesToMap
     */
    createMapping() {
        console.log(this.nodesToMap);
        // TODO: Currently setting only the simple type "Node"
        // --> We have to differ between different types of nodes (e.g. Method, Variable, ...)
        // --> Node types can be differentiated by checking the NodeClass. This is currently not in our model --> Fix parser
        let queryString = "";
        this.nodesToMap.forEach(node => {
            const keys = Object.keys(node);
            // create an individual for this node:
            queryString += `example:${node["browseName"]} rdf:type opc:node.\n`

            keys.forEach(key => {
                if(Array.isArray(node[key])) {
                    queryString += this.createObjectProperty(key, node);                        // add object properties
                } else {
                    queryString += `example:${node["browseName"]} opc:${key} "${node[key]}".\n`   // add data properties
                }
            });
        });
        console.log(queryString);
    }


    createObjectProperty(key: string, node: OpcNode): string{
        const array = node[key];
        let queryString = '';
        array.forEach(element => {
            if(this.isInNodesToMap(element)){
                queryString += `example:${node["browseName"]} opc:${key} example:${element["browseName"]}.\n`;
            }
        });
        return queryString;
    }


    /**
     * Checks whether or not a node is inside nodesToMap
     * @param node
     */
    isInNodesToMap(node: OpcNode){
        const index = this.nodesToMap.findIndex(nodeToMap =>
            nodeToMap.mappingId === node.mappingId
        )
        if (index == -1) {
            return false;
        } else {
            return true;
        }
    }

}
