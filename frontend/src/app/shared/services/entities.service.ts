import { Injectable } from '@angular/core';
import { PrefixesService } from './prefixes.service';

import { IRI } from 'iri';

@Injectable({
    providedIn: 'root'
})
export class EntitiesService {

    constructor(
    private nameSpaces: PrefixesService
    ) { }

    createNamedNode(wannaBeRDF: string) {
        wannaBeRDF = this.nameSpaces.addOrParseNamespace(wannaBeRDF);
        return new NamedNode(wannaBeRDF);
    }
    createLiterial(wannaBeLiterial: string) {
        return new Literial(wannaBeLiterial);
    }
    createBlankNode(wannaBeBlankNode: string) {
        return new BlankNode(wannaBeBlankNode);
    }
    createVariable(wannaBeVariable: string) {
        return new Variable(wannaBeVariable);
    }
    createNamedGraph(wannaBeNamedGraph) {
        return new NamedGraph(wannaBeNamedGraph);
    }

}

export class Entity {
  private value: string;

  public validateValue(wannaBe: string): boolean {
      if (typeof wannaBe === "string") {
          this.Value = wannaBe;
          return true;
      } else {
          return false;
      }
  }

  public set Value(value: string) {
      this.value = value;
  }

  public get Value() {
      return this.value;
  }
}

export class NamedNode extends Entity {

    constructor(wannaBeRDF: string) {
        super();
        this.validateValue(wannaBeRDF);
    }


    validateValue(wannaBeRDF: string): boolean {

        const IRI_REG = /^([a-z0-9+.-]+):(?:\/\/(?:((?:[a-z0-9-._~!$&'()*+,;=:]|%[0-9A-F]{2})*)@)?((?:[a-z0-9-._~!$&'()*+,;=]|%[0-9A-F]{2})*)(?::(\d*))?(\/(?:[a-z0-9-._~!$&'()*+,;=:@\/]|%[0-9A-F]{2})*)?|(\/?(?:[a-z0-9-._~!$&'()*+,;=:@]|%[0-9A-F]{2})+(?:[a-z0-9-._~!$&'()*+,;=:@\/]|%[0-9A-F]{2})*)?)(?:\?((?:[a-z0-9-._~!$&'()*+,;=:\/?@]|%[0-9A-F]{2})*))?(?:#((?:[a-z0-9-._~!$&'()*+,;=:\/?@]|%[0-9A-F]{2})*))?$/i;

        if (IRI_REG.test(wannaBeRDF)) {
            this.Value = wannaBeRDF;
            return true;
        } else {
            console.error("NO VALID STRING TO BUILD NAMED NODE");
            return false;
        }
    }

    get Path(){  
        const iri = new IRI(this.Value).resolveReference('#');
        return iri.path();
    }

    get Scheme(){  
        return new IRI(this.Value).scheme();
    }

    get userinfo(){  
        return new IRI(this.Value).userinfo();
    }

}

export class Literial extends Entity {

  entityType = entityTypes.literal;

  constructor(wannaBeLiterial: string) {
      super();

      this.Value = wannaBeLiterial;
  }
}

export class BlankNode extends Entity {

  entityType = entityTypes.blankNode;

  constructor(wannaBeBlankNode: string) {
      super();

      this.Value = wannaBeBlankNode;
  }
}

export class Variable extends Entity {

  entityType = entityTypes.variable;

  constructor(wannaBeVariable: string) {
      super();

      this.Value = wannaBeVariable;
  }
}

export class NamedGraph extends Entity {

  entityType = entityTypes.namedGraph;

  constructor(wannaBeNamedGraph: string) {
      super();

      this.Value = wannaBeNamedGraph;
  }
}

export enum entityTypes {
  namedNode = "namedNode",
  literal = "literal",
  blankNode = "blankNode",
  variable = "variable",
  namedGraph = "namedGraph"

}


