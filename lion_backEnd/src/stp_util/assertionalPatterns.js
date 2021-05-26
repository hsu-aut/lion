
/**
 * Prepends relevant namespaces and return the final ttl string.
 *
 * @param {String} Triples
 * @returns .ttl as string with prepended prefixes
 */
function prependPrefixes(Triples) {

    let prefixes = `
    @prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
    @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.
    @prefix VDI2206: <http://www.hsu-ifa.de/ontologies/VDI2206#>.
    `;

    return prefixes + "\n" +  Triples;
}

/**
 * Return VDI2206 compliant triples for a "system contains system" structure
 *
 * @param {String} System
 * @param {String} SystemLabel
 * @param {String} SubSystem
 * @param {String} SubSystemLabel
 * @returns 
 */
function createSystemContainsSystem(System, SystemLabel, SubSystem, SubSystemLabel) {

    System = '<urn:' + System + ">";
    SubSystem = '<urn:' + SubSystem + ">";

    var triples = `
    ${System} a VDI2206:System.
    ${System} rdfs:label "${SystemLabel}".
    ${System} VDI2206:SystemConsistsOfSystem ${SubSystem}.
    ${SubSystem} rdfs:label "${SubSystemLabel}".
    `;

    return triples
}


/**
 * Return VDI2206 compliant triples for a "system contains component" structure
 *
 * @param {String} System
 * @param {String} SystemLabel
 * @param {String} Component
 * @param {String} ComponentLabel
 * @returns
 */
function createSystemContainsComponent(System, SystemLabel, Component, ComponentLabel) {

    System = '<urn:' + System + ">";
    Component = '<urn:' + Component + ">";

    var triples = `
    ${System} a VDI2206:System.
    ${System} rdfs:label "${SystemLabel}".
    ${System} VDI2206:SystemConsistsOfComponent ${Component}.
    ${Component} a VDI2206:Component.
    ${Component} rdfs:label "${ComponentLabel}".
    `;

    return triples
}


/**
 * Returns VDI2206 compliant triples for a "component"
 *
 * @param {String} Component
 * @param {String} ComponentLabel
 * @returns
 */
function createComponent(Component, ComponentLabel) {

    Component = '<urn:' + Component + ">";

    var triples = `
    ${Component} a VDI2206:Component.
    ${Component} rdfs:label "${ComponentLabel}".
    `;

    return triples

}

/**
 * Builds a .ttl from a jsonObject
 *
 * @param {Object} stepObject
 * @returns .ttl as String
 */
function mapJsonToRDF(stepObject) {


    let rdf = recursiveBuildRDF(stepObject);

    rdf = removeDuplicates(rdf);

    rdf = prependPrefixes(rdf);


    // console.log(rdf)
    return rdf

}

/**
 * Builds a .ttl from a jsonObject
 *
 * @param {Object} stepObject
 * @returns .ttl as String
 */
function recursiveBuildRDF(stepObject) {

    let rdf = "";

    if (!stepObject.contains.length > 0) {

        rdf = rdf + createComponent(stepObject.id, stepObject.name);
    } else {
        stepObject.contains.forEach(contained => {

            if (!contained.contains.length > 0) {

                rdf = rdf + createSystemContainsComponent(stepObject.id, stepObject.name, contained.id, contained.name);

            } else {

                rdf = rdf + createSystemContainsSystem(stepObject.id, stepObject.name, contained.id, contained.name);
                rdf = rdf + recursiveBuildRDF(contained);
            }
        });
    }

    return rdf
}

module.exports.mapJsonToRDF = mapJsonToRDF;

function removeDuplicates(turtleString) {

    // split on punctuation and line ending
    let triples = turtleString.toString().split(".\n");

    // remove all tabs, leading and trailing whitespaces as well as linebraeaks from each entry of array
    for (let i = 0; i < triples.length; i++) {
        triples[i] = triples[i].replace(/(\r\n|\n|\r|\t|^[ \t]+|[ \t]+$)/gm, "");
    }
    // remove duplicates
    triples = Array.from(new Set(triples))

    // add punctiation again and one line break
    let rdf = "";
    triples.forEach(element => {
        let currentString = element;
        if (currentString != "") {
            currentString = element + ".";
            rdf = rdf + currentString + "\n";
        }
    });

    return rdf
}