import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PrefixesService {

    constructor() { }

  DefaultNamespaces = new DefaultNamespaces;
  PREFIXES = this.DefaultNamespaces.PREFIXES;
  // GRAPHS = this.prefixes.GRAPHS;
  // activeGraph = this.prefixes.activeGraph;
  activeNamespace = this.DefaultNamespaces.activeNamespace;

  getPrefixes() {
      return this.PREFIXES;
  }

  addNamespace(PREFIX, NAMESPACE) {
      const pre = PREFIX;
      const name = NAMESPACE;
      const entry = { prefix: pre, namespace: name };
      this.PREFIXES.push(entry);
  }

  editNamespace(key, userPrefix, userNamespace) {
      this.PREFIXES[key].prefix = userPrefix;
      this.PREFIXES[key].namespace = userNamespace;
  }

  deleteNamespace(key) {
      this.PREFIXES.splice(key, 1);
  }

  getActiveNamespace() {
      return this.activeNamespace;
  }

  setActiveNamespace(key) {
      const max = this.PREFIXES.length;

      if (key <= max) {
          this.activeNamespace = key;
      }
  }

  getPrefixString() {
      const PREFIXES = this.getPrefixes();
      let prefixString = "";

      for (let index = 0; index < PREFIXES.length; index++) {
          prefixString = prefixString + "PREFIX " + PREFIXES[index].prefix + `<${PREFIXES[index].namespace}>` + "\n";
      }

      return prefixString;
  }

  addOrParseNamespace(individual) {
      const PREFIXES = this.getPrefixes();
      const activeNamespace = PREFIXES[this.getActiveNamespace()].namespace;

      if(individual.search("urn:") != -1){
          individual = individual;
      } else if (individual.search("http://") != -1) {
          individual = individual;
      } else if (individual.search(":") != -1) {
          const newindividual = this.parseToIRI(individual);
          if (newindividual != individual) {
              individual = newindividual;
          } else {
              individual = activeNamespace + individual;
          }
      } else {
          individual = activeNamespace + individual;
      }
      return individual;
  }


  parseToName(IndividualWithPrefix: string): string {
      const PREFIXES = this.getPrefixes();
      //console.log(PREFIXES)
      const prefixedName: string = IndividualWithPrefix;
      let name: string;
      let parsed: boolean;
      if (prefixedName.search("http:") != -1) {
          const IRI = prefixedName;
          const nameArray = IRI.split("#");
          return nameArray[1];
      }
      for (let i = 0; i < PREFIXES.length; i++) {

          if (prefixedName.search(PREFIXES[i].prefix) != -1) {

              name = prefixedName.replace(PREFIXES[i].prefix, "");
              //console.log(name);
              parsed = true;
          }
      }
      if (parsed == true) {
          return name;
      } else return IndividualWithPrefix;
  }

  parseToIRI(IndividualWithPrefix: string): string {
      const PREFIXES = this.getPrefixes();
      const prefixedName: string = IndividualWithPrefix;
      let name: string;
      let IRI: string;
      let parsed: boolean;

      if (prefixedName.search("#") != -1) { return IndividualWithPrefix; }
      for (let i = 0; i < PREFIXES.length; i++) {

          if (prefixedName.search(PREFIXES[i].prefix) != -1) {

              name = prefixedName.replace(PREFIXES[i].prefix, "");
              IRI = PREFIXES[i].namespace + name;
              parsed = true;
              break;
          }
      }
      if (parsed) {
          return IRI;
      } else return IndividualWithPrefix;

  }

  parseToPrefix(SPARQLReturn: any) {
      const PREFIXES = this.getPrefixes();
      const returnObject = SPARQLReturn;
      // loop iterates over all results
      for (const key in returnObject.results.bindings) {
          if (returnObject.results.bindings.hasOwnProperty(key)) {
              const element = returnObject.results.bindings[key];
              // console.log(element)
              // loop iterates over all values of a result
              for (const key2 in element) {
                  if (element.hasOwnProperty(key2)) {
                      const elementValue = element[key2];
                      // console.log(elementValue)
                      // for each value it is checked whether there is a prefix to be used or not
                      for (let ii = 0; ii < PREFIXES.length; ii++) {
                          // help variable to use string function
                          const str = elementValue.value;
                          // if a binding is using a namespace known to the app, then it is replaced by the known prefix
                          if (str.search(PREFIXES[ii].namespace) != -1) {
                              elementValue.value = str.replace(PREFIXES[ii].namespace, PREFIXES[ii].prefix);
                              // console.log(elementValue.value);
                          }
                      }
                  }
              }
          }
      }

      return returnObject;
  }

}

export interface Prefix {
  prefix: string;
  namespace: string;
}

export class DefaultNamespaces {

  public PREFIXES: Array<Prefix> = [

      { prefix: "VDI3682:", namespace: "http://www.hsu-ifa.de/ontologies/VDI3682#" },
      { prefix: "VDI2206:", namespace: "http://www.hsu-ifa.de/ontologies/VDI2206#" },
      { prefix: "DE6:", namespace: "http://www.hsu-ifa.de/ontologies/DINEN61360#" },
      { prefix: "ISA88:", namespace: "http://www.hsu-ifa.de/ontologies/ISA-TR88#" },
      { prefix: "wadl:", namespace: "http://www.hsu-ifa.de/ontologies/WADL#"},
      { prefix: "OpcUa:", namespace: "http://www.hsu-ifa.de/ontologies/OpcUa#"},
      { prefix: "iso:", namespace: "http://www.hsu-ifa.de/ontologies/ISO22400-2#"},
      { prefix: "rdf:", namespace: "http://www.w3.org/1999/02/22-rdf-syntax-ns#" },
      { prefix: "rdfs:", namespace: "http://www.w3.org/2000/01/rdf-schema#" },
      { prefix: "owl:", namespace: "http://www.w3.org/2002/07/owl#" },
      { prefix: "lf:", namespace: "http://lionFacts#" }
  ]

  public activeNamespace: number = this.PREFIXES.length - 1;

}
