import { Injectable } from '@angular/core';
import { OpcNode } from './subcomponents/opc-mapping-element.component';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigurationService } from '../../shared/services/backEnd/configuration.service';

@Injectable({
  providedIn: 'root'
})
export class OpcMappingService {

constructor(
    private httpClient: HttpClient,
    private config: ConfigurationService,
    ) {}

    nodesToMap = new Array<OpcNode>();
    opcRoute = '/lion_BE/opc-ua'


    crawlServer(serverInfo: OpcUaServerInfo): Observable<any> {
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
    createMapping(serverInfo: OpcUaServerInfo): Observable<string> {
        // Add server info to nodes that should be mapped
        const dataToMap = {
            repository: this.config.getRepository(),
            opc: {
                serverInfo: serverInfo,
                nodesToMap: this.nodesToMap
            }
        }
        console.log(dataToMap.repository)
        return this.httpClient.post(`${this.opcRoute}/mappings`, dataToMap) as Observable<string>;
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


export interface OpcUaServerInfo {
    endpointUrl: string,
    securityPolicy: string,
    messageSecurityMode: string,
    username: string,
    password: string,
}
