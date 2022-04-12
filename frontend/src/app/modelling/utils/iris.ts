// import { IRI } from "iri";

//  lib is http://rdf.js.org/, based on http://rdf.js.org/data-model-spec/
// import * as RDFJS from 'rdf-js';

/**
 *  A Factory Pattern to build valid term objects based on an input
 */
export class RDF_Factory {

    entity: Entity;

    constructor(entityType: entityTypes, wannaBeRDF: string) {
        console.log(entityType);
        console.log(wannaBeRDF);
        // switch (entityType) {
        //     case entityTypes.namedNode:
        //         this.entity = new NamedNode(wannaBeRDF);
        //         break;
        //     case entityTypes.literal:
        //         this.entity = new Literial(wannaBeRDF);
        //         break;
        //     case entityTypes.blankNode:
        //         this.entity = new BlankNode(wannaBeRDF);
        //         break;
        //     case entityTypes.variable:
        //         this.entity = new Variable(wannaBeRDF);
        //         break;
        //     case entityTypes.namedGraph:
        //         this.entity = new NamedGraph(wannaBeRDF);
        //         break;
        // }
    }


}




class Entity {

    public entityType: entityTypes;
    public value: string;

}


export class NamedNode {

    entityType: string = entityTypes.namedNode;
    value: string;


    constructor(wannaBeRDF: string) {
        this.buildNamedNode(wannaBeRDF);
    }

    private buildNamedNode(wannaBeRDF: string){
        const IRI_REG = /^([a-z0-9+.-]+):(?:\/\/(?:((?:[a-z0-9-._~!$&'()*+,;=:]|%[0-9A-F]{2})*)@)?((?:[a-z0-9-._~!$&'()*+,;=]|%[0-9A-F]{2})*)(?::(\d*))?(\/(?:[a-z0-9-._~!$&'()*+,;=:@\/]|%[0-9A-F]{2})*)?|(\/?(?:[a-z0-9-._~!$&'()*+,;=:@]|%[0-9A-F]{2})+(?:[a-z0-9-._~!$&'()*+,;=:@\/]|%[0-9A-F]{2})*)?)(?:\?((?:[a-z0-9-._~!$&'()*+,;=:\/?@]|%[0-9A-F]{2})*))?(?:#((?:[a-z0-9-._~!$&'()*+,;=:\/?@]|%[0-9A-F]{2})*))?$/i;

        if(IRI_REG.test(wannaBeRDF)){
            this.value = wannaBeRDF;
        } else {
            console.error("NO VALID IRI ENCODED STRING TO BUILD NAMED NDOE");
        }

    }


}

class Literial extends Entity {

    constructor(wannaBeRDF: string) {
        super();
        this.entityType = entityTypes.literal;
        this.value = wannaBeRDF;
    }
}

class BlankNode extends Entity {

    constructor(wannaBeRDF: string) {
        super();
        this.entityType = entityTypes.blankNode;
        this.value = wannaBeRDF;
    }
}

class Variable extends Entity {

    constructor(wannaBeRDF: string) {
        super();
        this.entityType = entityTypes.variable;
        this.value = wannaBeRDF;
    }
}

class NamedGraph extends Entity {

    constructor(wannaBeRDF: string) {
        super();
        this.entityType = entityTypes.namedGraph;
        this.value = wannaBeRDF;
    }
}


export enum entityTypes {
    namedNode = "namedNode",
    literal = "literal",
    blankNode = "blankNode",
    variable = "variable",
    namedGraph = "namedGraph"

}


