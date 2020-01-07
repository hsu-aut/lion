import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OpcMappingService {

constructor() {}

    nodesToMap = [];


    // Adds one OPC UA node to the list of nodes to map into the ontology
    addOpcNode(node: {}) {
        this.nodesToMap.push(node);
    }


    /**
     * Removes one OPC UA node from the list of nodes to map into the ontology
     * @param id Id of the node to delete (This ID gets randomly generated)
     */
    removeOpcNode(id: string) {
        this.nodesToMap = this.nodesToMap.filter(elem => {
            elem.id != id;
        })
    }


    /**
     * Outputs the current list of nodes that are going to be mapped into the ontology
     */
    getSelection() {
        console.log(this.nodesToMap);
    }

}
