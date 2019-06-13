import { Injectable } from '@angular/core';
import { Namespace } from '../../utils/prefixes';



@Injectable({
  providedIn: 'root'
})
export class PrefixesService {

  constructor() {}

  prefixes = new Namespace;
  PREFIXES = this.prefixes.PREFIXES;
  GRAPHS = this.prefixes.GRAPHS;
  activeGraph = this.prefixes.activeGraph;
  activeNamespace = this.prefixes.activeNamespace;

  getPrefixes() {
    return this.PREFIXES;
  }

  getGraphs() {
    return this.GRAPHS;
  }

  addGraph(namespace: string) {

    let name = namespace;
    this.GRAPHS.push(name);
  }

  addNamespace(PREFIX, NAMESPACE) {
    let pre = PREFIX;
    let name = NAMESPACE;
    let entry = { prefix: pre, namespace: name };
    this.PREFIXES.push(entry);
  }

  editNamespace(key, userPrefix, userNamespace) {
    this.PREFIXES[key].prefix = userPrefix;
    this.PREFIXES[key].namespace = userNamespace;
  }

  editGraph(key, userNamespace) {
    this.GRAPHS[key] = userNamespace;
  }

  deleteNamespace(key) {
    this.PREFIXES.splice(key, 1);
  }

  deleteGraph(key) {
    this.GRAPHS.splice(key, 1);
  }

  getActiveNamespace() {
    return this.activeNamespace;
  }

  getActiveGraph() {
    return this.activeGraph;
  }

  setActiveNamespace(key) {
    let max = this.PREFIXES.length;

    if (key <= max) {
      this.activeNamespace = key;
    }
  }

  setActiveGraph(key) {
    let max = this.GRAPHS.length;

    if (key <= max) {
      this.activeGraph = key;
    }
  }


  getPrefixString() {
    var PREFIXES = this.getPrefixes();
    var prefixString: string = ""

    for (let index = 0; index < PREFIXES.length; index++) {
      prefixString = prefixString + "PREFIX " + PREFIXES[index].prefix + `<${PREFIXES[index].namespace}>` + "\n"
    }

    return prefixString
  }

  
  parseToName(IndividualWithPrefix: string): string {
    var PREFIXES = this.getPrefixes();
    //console.log(PREFIXES)
    var prefixedName: string = IndividualWithPrefix;
    var name: string;
    var parsed: boolean;
    if (prefixedName.search("http:") != -1) {
      var IRI = prefixedName;
      var nameArray = IRI.split("#")
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
    } else return IndividualWithPrefix
  }

  parseToIRI(IndividualWithPrefix: string): string {
    var PREFIXES = this.getPrefixes();
    var prefixedName: string = IndividualWithPrefix;
    var name: string;
    var IRI: string;
    var parsed: boolean;

    if (prefixedName.search("#") != -1) { return IndividualWithPrefix }
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
    } else return IndividualWithPrefix

  }

  parseToPrefix(SPARQLReturn: any) {
    var PREFIXES = this.getPrefixes();
    var returnObject = SPARQLReturn;
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
              var str = elementValue.value
              // if a binding is using a namespace known to the app, then it is replaced by the known prefix
              if (str.search(PREFIXES[ii].namespace) != -1) {
                elementValue.value = str.replace(PREFIXES[ii].namespace, PREFIXES[ii].prefix)
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
