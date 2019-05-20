class Prefix {
    prefix: string;
    namespace: string;
}

export class Namespace {

    public PREFIXES: Array<Prefix> = [
        { prefix: "VDI3682:", namespace: "http://www.hsu-ifa.de/ontologies/VDI3682#" },
        { prefix: "VDI2206:", namespace: "http://www.hsu-ifa.de/ontologies/VDI2206#" },
        { prefix: "DE6:", namespace: "http://www.hsu-ifa.de/ontologies/DINEN61360#" },
        { prefix: "ISA88:", namespace: "http://www.hsu-ifa.de/ontologies/ISA-TR88#" },
        { prefix: "rdf:", namespace: "http://www.w3.org/1999/02/22-rdf-syntax-ns#" },
        { prefix: "rdfs:", namespace: "http://www.w3.org/2000/01/rdf-schema#" },
        { prefix: "owl:", namespace: "http://www.w3.org/2002/07/owl#" },
        { prefix: ":", namespace: "http://lionFacts#" }
    ] 

    public activeNamespace: number = this.PREFIXES.length - 1;


    public getPrefixString() {
        var prefixString: string = ""

        for (let index = 0; index < this.PREFIXES.length; index++) {
            prefixString = prefixString + "PREFIX " + this.PREFIXES[index].prefix + `<${this.PREFIXES[index].namespace}>` + "\n"
        }
        console.log(prefixString)
        return prefixString
    }
    // parses a single Individual with Prefix e.g. "SA4:Machine123" and puts the actual namespace infront


    public parseToName(IndividualWithPrefix: string): string {
        var prefixedName: string = IndividualWithPrefix;
        var name: string;
        var parsed: boolean;
        for (let i = 0; i < this.PREFIXES.length; i++) {

            if (prefixedName.search(this.PREFIXES[i].prefix) != -1) {

                name = prefixedName.replace(this.PREFIXES[i].prefix, "");
                // console.log(name);
                parsed = true;
            }
        }
        if (parsed == true) {
            return name;
        } else return IndividualWithPrefix
    }

    parseToIRI(IndividualWithPrefix: string): string {
        var prefixedName: string = IndividualWithPrefix;
        var name: string;
        var IRI: string;
        var parsed: boolean;

    if(prefixedName.search("#") != -1){return IndividualWithPrefix}
        for (let i = 0; i < this.PREFIXES.length; i++) {

            if (prefixedName.search(this.PREFIXES[i].prefix) != -1) {

                name = prefixedName.replace(this.PREFIXES[i].prefix, "");
                IRI = this.PREFIXES[i].namespace + name;
                // console.log(IRI);
                parsed = true;
                break;
            }
        }
        if (parsed) {
            return IRI;
        } else return IndividualWithPrefix

    }


    public parseToPrefix(SPARQLReturn: any) {
        // just for testing, should be assigned to the argument of the function
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
                        for (let ii = 0; ii < this.PREFIXES.length; ii++) {
                            // help variable to use string function
                            var str = elementValue.value
                            // if a binding is using a namespace known to the app, then it is replaced by the known prefix
                            if (str.search(this.PREFIXES[ii].namespace) != -1) {
                                elementValue.value = str.replace(this.PREFIXES[ii].namespace, this.PREFIXES[ii].prefix)
                                // console.log(elementValue.value);
                            }
                        }
                    }
                }
            }
        }


        // for (let i = 0; i < variables.length; i++) {
        //     var x = variables[i];

        //     // loop iterates over all bindings for every variable
        //     returnObject.results.bindings.forEach(element => {
        //         console.log(element[x].value);

        //             for (let ii = 0; ii < this.PREFIXES.length; ii++) {
        //                 // help variable to use string function
        //                 var str = element[x].value
        //                 // if a binding is using a namespace known to the app, then it is replaced by the known prefix
        //                 if(str.search(this.PREFIXES[ii].namespace) != -1) {
        //                     element[x].value = str.replace(this.PREFIXES[ii].namespace,this.PREFIXES[ii].prefix)
        //                     console.log(element[x].value);
        //                 }
        //             }

        //     });
        // }
        return returnObject;
    }
}
