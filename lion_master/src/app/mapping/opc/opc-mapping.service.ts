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
        this.nodesToMap.push(node);
    }


    /**
     * Removes one OPC UA node from the list of nodes to map into the ontology
     * @param id Id of the node to delete (This ID gets randomly generated)
     */
    removeOpcNode(id: string) {
        // Filter the list to get all elements that do not have the given ID
        this.nodesToMap = this.nodesToMap.filter(elem =>
            elem.id != id
        )
    }


    /**
     * Outputs the current list of nodes that are going to be mapped into the ontology
     */
    getSelection() {
        console.log(this.nodesToMap);

        let queryString = "";
        // this.nodesToMap.forEach(node => {

        // });
    }

}
