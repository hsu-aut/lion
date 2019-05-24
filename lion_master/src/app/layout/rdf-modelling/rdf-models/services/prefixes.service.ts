import { Injectable } from '@angular/core';
import { Namespace } from '../../utils/prefixes';


@Injectable({
  providedIn: 'root'
})
export class PrefixesService {

  constructor() { }

  prefixes = new Namespace;

  getPrefixes() {
    return this.prefixes.PREFIXES;
  }
  addNamespace(PREFIX, NAMESPACE) {
    let pre = PREFIX;
    let name = NAMESPACE;
    let entry = { prefix: pre, namespace: name };
    this.prefixes.PREFIXES.push(entry);
  }

  editNamespace(key, userPrefix, userNamespace) {
    this.prefixes.PREFIXES[key].prefix = userPrefix;
    this.prefixes.PREFIXES[key].namespace = userNamespace;
  }

  deleteNamespace(key) {
    this.prefixes.PREFIXES.splice(key, 1);
  }

  getActiveNamespace() {
    return this.prefixes.activeNamespace;
  }

  setActiveNamespace(key) {
    let max = this.prefixes.PREFIXES.length;

    if (key <= max) {
      this.prefixes.activeNamespace = key;
    }
  }


  getPrefixString() {
    var PREFIXES = this.getPrefixes();
    var prefixString: string = ""

    for (let index = 0; index < PREFIXES.length; index++) {
      prefixString = prefixString + "PREFIX " + PREFIXES[index].prefix + `<${PREFIXES[index].namespace}>` + "\n"
    }
    console.log(prefixString)
    return prefixString
  }

  parseToName(IndividualWithPrefix: string): string {
    var PREFIXES = this.getPrefixes();
    var prefixedName: string = IndividualWithPrefix;
    var name: string;
    var parsed: boolean;
    for (let i = 0; i < PREFIXES.length; i++) {

      if (prefixedName.search(PREFIXES[i].prefix) != -1) {

        name = prefixedName.replace(PREFIXES[i].prefix, "");
        // console.log(name);
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
        // console.log(IRI);
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
    console.log(PREFIXES);
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
