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
        const index = this.nodesToMap.findIndex(elem =>
            elem.mappingId == node.mappingId
        )
        if(index == -1) {
            this.nodesToMap.push(node);
        }
    }

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


    removeAllChildren(nodeData: {}) {
        const keys = Object.keys(nodeData);
        keys.forEach(key => {
            const currentElement = nodeData[key]
            if (Array.isArray(currentElement)) {
                currentElement.forEach(elem => {
                    this.removeOpcNode(elem);
                    this.removeAllChildren(elem);
                });
            }
        });
    }


    /**
     * Outputs the current list of nodes that are going to be mapped into the ontology
     */
    getSelection() {
        console.log(this.nodesToMap);

        let queryString = "";
        this.nodesToMap.forEach(node => {
            const keys = Object.keys(node);
            keys.forEach(key => {
                queryString += `opc:${key} ${node[key]}\n`
            });
        });
        console.log(queryString);
    }

}
