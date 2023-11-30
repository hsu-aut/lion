import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PrefixesService {

    constructor() { }

    // TODO: This should be stored in a config database / file
    defaultPrefixes: Array<Prefix> =[
        new Prefix("VDI3682:","http://www.hsu-ifa.de/ontologies/VDI3682#"),
        new Prefix("VDI2206:", "http://www.hsu-ifa.de/ontologies/VDI2206#"),
        new Prefix("DE6:",  "http://www.w3id.org/hsu-aut/DINEN61360#"),
        new Prefix("ISA88:",  "http://www.hsu-ifa.de/ontologies/ISA-TR88#"),
        new Prefix("wadl:",  "http://www.hsu-ifa.de/ontologies/WADL#"),
        new Prefix("OpcUa:",  "http://www.hsu-ifa.de/ontologies/OpcUa#"),
        new Prefix("iso:",  "http://www.hsu-ifa.de/ontologies/ISO22400-2#"),
        new Prefix("rdf:",  "http://www.w3.org/1999/02/22-rdf-syntax-ns#"),
        new Prefix("rdfs:",  "http://www.w3.org/2000/01/rdf-schema#"),
        new Prefix("owl:",  "http://www.w3.org/2002/07/owl#"),
        new Prefix("lf:",  "http://lionFacts#")
    ];

    activeNamespace: Prefix = this.defaultPrefixes[this.defaultPrefixes.length - 1];


    getPrefixes(): Array<Prefix> {
        return this.defaultPrefixes;
    }

    addNamespace(prefix: string, namespace: string): void {
        const entry = new Prefix(prefix, namespace);
        this.defaultPrefixes.push(entry);
    }

    editNamespace(key: number, newPrefix: string, newNamespace: string): void {
        this.defaultPrefixes[key].prefix = newPrefix;
        this.defaultPrefixes[key].namespace = newNamespace;
    }

    deleteNamespace(key: number): void {
        this.defaultPrefixes.splice(key, 1);
    }

    getActiveNamespace():Prefix {
        return this.activeNamespace;
    }

    setActiveNamespace(key:number): void {
        const max = this.defaultPrefixes.length;

        if (key <= max) {
            this.activeNamespace = this.defaultPrefixes[key];
        }
    }

    getPrefixString(): string {
        const PREFIXES = this.getPrefixes();
        let prefixString = "";

        for (let index = 0; index < PREFIXES.length; index++) {
            prefixString = prefixString + "PREFIX " + PREFIXES[index].prefix + `<${PREFIXES[index].namespace}>` + "\n";
        }

        return prefixString;
    }

    addOrParseNamespace(individual: string): string  {
        if (individual.search("urn:") != -1) return individual;

        if (individual.search("http://") != -1) return individual;

        if (individual.search(":") != -1) {
            const newindividual = this.parseToIRI(individual);
            if (newindividual != individual) {
                individual = newindividual;
            } else {
                individual = this.activeNamespace.namespace + individual;
            }
        } else {
            individual = this.activeNamespace.namespace + individual;
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

export class Prefix {
    constructor(public prefix: string, public namespace: string) {}
}
