import { Injectable } from '@angular/core';
import { OpcNode } from './subcomponents/opc-mapping-element.component';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpcMappingService {

constructor(private httpClient: HttpClient) {}

    nodesToMap = new Array<OpcNode>();
    opcRoute = '/lion_BE/opc-ua'


    crawlServer(serverInfo: ServerInfo): Observable<any> {
        return this.httpClient.post(`${this.opcRoute}/crawl-server`, serverInfo);
    }

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
            elem.nodeId != node.nodeId
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
    createMapping(): Observable<string> {
        // console.log(this.nodesToMap);
        // // TODO: Currently setting only the simple type "Node"
        // // --> We have to differ between different types of nodes (e.g. Method, Variable, ...)
        // // --> Node types can be differentiated by checking the NodeClass. Currently only the nodeClass od the root node is in the parsed model.
        // // --> Seems to be a problem with the parser
        // let queryString = "";
        // this.nodesToMap.forEach(node => {
        //     const keys = Object.keys(node);
        //     // create an individual for this node:
        //     queryString += `example:${node["browseName"]} rdf:type opc:node.\n`

        //     keys.forEach(key => {
        //         if(Array.isArray(node[key])) {
        //             queryString += this.createObjectProperty(key, node);                        // add object properties
        //         } else {
        //             queryString += `example:${node["browseName"]} opc:${key} "${node[key]}".\n`   // add data properties
        //         }
        //     });
        // });
        // console.log(queryString);
        console.log("creating mappings");

        return this.httpClient.post(`${this.opcRoute}/mappings`, this.nodesToMap) as Observable<string>;
    }





    /**
     * Checks whether or not a node is inside nodesToMap
     * @param node
     */
    isInNodesToMap(node: OpcNode){
        const index = this.nodesToMap.findIndex(nodeToMap =>
            nodeToMap.nodeId === node.nodeId
        )
        if (index == -1) {
            return false;
        } else {
            return true;
        }
    }

}


export interface ServerInfo {
    endpointUrl: string,
    securityPolicy: string,
    messageSecurityMode: string,
    username: string,
    password: string,
}
