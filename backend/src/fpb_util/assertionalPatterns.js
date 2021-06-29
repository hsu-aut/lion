// const fpb = require('./fpb');
// const fs = require('fs');

// /**
//  * Prepends relevant namespaces and return the final ttl string.
//  *
//  * @param {String} Triples
//  * @returns .ttl as string with prepended prefixes
//  */
// function prependPrefixes(Triples) {

// 	const prefixes = `
//     @prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
//     @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.
//     @prefix VDI3682: <http://www.hsu-ifa.de/ontologies/VDI3682#>.
//     `;

// 	return prefixes + "\n" + Triples;
// }

// function createFlowObject(flowObject) {

// 	let flowClass;
// 	const flowID = '<urn:' + flowObject.id + ">";

// 	if (flowObject instanceof fpb.Product) {
// 		flowClass = flowID + " a VDI3682:Product.\n";
// 	} else if (flowObject instanceof fpb.Energy) {
// 		flowClass = flowID + " a VDI3682:Energy.\n";
// 	} else if (flowObject instanceof fpb.Information) {
// 		flowClass = flowID + " a VDI3682:Information.\n";
// 	} else if (flowObject instanceof fpb.TechnicalResource) {
// 		flowClass = flowID + " a VDI3682:TechnicalResource.\n";
// 	} else if (flowObject instanceof fpb.ProcessOperator) {
// 		flowClass = flowID + " a VDI3682:Process.\n";
// 	}

// 	const commonTriples = `
//     ${flowID} VDI3682:shortName "${flowObject.shortName}".
//     ${flowID} VDI3682:longName "${flowObject.longName}".
//     `;

// 	let flowTriples = "";

// 	if (flowObject instanceof (fpb.Product || fpb.Energy || fpb.Information)) {
// 		flowObject.incomingObjects.forEach(incomingObject => {
// 			const incomingObjectId = '<urn:' + incomingObject + ">";
// 			flowTriples = flowTriples + `${flowID} VDI3682:isOutputOf ${incomingObjectId}.\n`;
// 		});

// 		flowObject.outgoingObjects.forEach(outgoingObject => {
// 			const outgoingObjectId = '<urn:' + outgoingObject + ">";
// 			flowTriples = flowTriples + `${flowID} VDI3682:isInputFor ${outgoingObjectId}.\n`;
// 		});
// 	} else if (flowObject instanceof (fpb.TechnicalResource)) {
// 		flowObject.outgoingObjects.forEach(outgoingObject => {
// 			const outgoingObjectId = '<urn:' + outgoingObject + ">";
// 			flowTriples = flowTriples + `${flowID} VDI3682:TechnicalResourceIsAssignedToProcessOperator ${outgoingObjectId}.\n`;
// 		});
// 	}

// 	const triples = flowClass + commonTriples + flowTriples;

// 	return triples;
// }


// function createRelations(relationObject, statesArray) {

// 	const domainId = "<urn:" + relationObject.source + ">";
// 	const rangeId = "<urn:" + relationObject.target + ">";

// 	const sourceObject = statesArray.find(stateObject => relationObject.source == stateObject.id);

// 	let triples = "";

// 	if (relationObject instanceof fpb.ParallelFlow) {

// 		if (sourceObject instanceof (fpb.Product || fpb.Information || fpb.Energy)) {
// 			triples = triples + `${domainId} VDI3682:isParallelInputFor ${rangeId}.\n`;
// 		} else if (sourceObject instanceof fpb.ProcessOperator) {
// 			triples = triples + `${domainId} VDI3682:hasParallelOutput ${rangeId}.\n`;
// 		}

// 	} else if (relationObject instanceof fpb.AlternativeFlow) {

// 		if (sourceObject instanceof (fpb.Product || fpb.Information || fpb.Energy)) {
// 			triples = triples + `${domainId} VDI3682:isAlternativeInputFor ${rangeId}.\n`;
// 		} else if (sourceObject instanceof fpb.ProcessOperator) {
// 			triples = triples + `${domainId} VDI3682:hasAlternativeOutput ${rangeId}.\n`;
// 		}
// 	}

// 	return triples;
// }

// function createProcess(processObject) {

// 	//  kein Individual für den process erzeugen!

// 	const systemBoundaryId = "<urn:" + processObject.systemBoundary.id + ">";

// 	const systemBoundaryTriple = systemBoundaryId + " a VDI3682:SystemBorder.\n";

// 	let triples = systemBoundaryTriple;

// 	// put states on boarder
// 	for (let i = 0; i < processObject.systemBoundary.onBoarder.length; i++) {
// 		const onBoarderTriple = '<urn:' + processObject.systemBoundary.onBoarder[i] + ">" + ' VDI3682:isOnSystemBorder ' + systemBoundaryId + ".\n";
// 		triples = triples + onBoarderTriple;
// 	}

// 	// add decomposition from system limit to upper process
// 	if (processObject.isDecomposedProcessOperator != null) {
// 		const upperProcessId = "<urn:" + processObject.isDecomposedProcessOperator + ">";
// 		const compositionTriple = `${upperProcessId} VDI3682:hasUpperProcess ${systemBoundaryId}.\n`;
// 		triples = triples + compositionTriple;
// 	}

// 	// put every process operator within system border
// 	processObject.processOperators.forEach(processOperator => {
// 		const processOperatorId = "<urn:" + processOperator.id + ">";
// 		const withinTriple = `${processOperatorId} VDI3682:isWithinSystemBorder ${systemBoundaryId}.\n`;
// 		triples = triples + withinTriple;
// 	});

// 	// for each of states put within system boarder if not onBoarder
// 	processObject.states.forEach(state => {
// 		if (processObject.systemBoundary.onBoarder.findIndex(id => state.id == id) == -1) {
// 			const stateId = "<urn:" + state.id + ">";
// 			const withinTriple = `${stateId} VDI3682:isWithinSystemBorder ${systemBoundaryId}.\n`;
// 			triples = triples + withinTriple;
// 		}
// 	});

// 	return triples;
// }

// function mapJsonToRDF(fpbjsJSON) {

// 	// deserialize fpbjs
// 	const model = buildModel(fpbjsJSON);

// 	// build ttl string
// 	let rdf = buildRDF(model);

// 	// remove duplicates 
// 	rdf = removeDuplicates(rdf);

// 	// prepend prefixes
// 	rdf = prependPrefixes(rdf);

// 	return rdf;

// }

// function buildRDF(fpbjsModel) {

// 	let rdf = "";

// 	// for all processes
// 	for (let i = 0; i < fpbjsModel.process.length; i++) {

// 		//  build general process triples
// 		rdf = rdf + createProcess(fpbjsModel.process[i]);

// 		// build states
// 		fpbjsModel.process[i].states.forEach(state => {
// 			rdf = rdf + createFlowObject(state);
// 		});
// 		// build processOperators
// 		fpbjsModel.process[i].processOperators.forEach(processOperator => {
// 			rdf = rdf + createFlowObject(processOperator);
// 		});
// 		// build technical resources
// 		fpbjsModel.process[i].resources.forEach(resource => {
// 			rdf = rdf + createFlowObject(resource);
// 		});

// 		// add relations
// 		rdf = rdf + createRelations(fpbjsModel.process[i].relations, fpbjsModel.process[i].states);

// 	}

// 	return rdf;
// }


// function buildModel(fpbjsJSON) {

// 	// initialize model
// 	const fileProjectInfo = fpbjsJSON.find(object => object.$type == "fpb:Project");
// 	var model = new fpb.Project(fileProjectInfo.targetNamespace + "/" + fileProjectInfo.name, fileProjectInfo.name);

// 	const processArray = [];

// 	// build array of processes
// 	for (let i = 0; i < fpbjsJSON.length; i++) {
// 		if (fpbjsJSON[i].hasOwnProperty("process")) {
// 			processArray.push(buildProcess(fpbjsJSON[i]));
// 		}
// 	}

// 	// add process array to model
// 	model.process = processArray;

// 	return model;

// }

// function buildProcess(fpbjsJson_Process_Object) {

// 	// create new process
// 	const process = new fpb.Process(fpbjsJson_Process_Object.process.id, fpbjsJson_Process_Object.process.name);

// 	// add system boundary
// 	process.systemBoundary = new fpb.SystemBoundary(fpbjsJson_Process_Object.process.consistsOfSystemLimit, fpbjsJson_Process_Object.process.name);

// 	// add decomposition relation

// 	process.isDecomposedProcessOperator = fpbjsJson_Process_Object.process.isDecomposedProcessOperator;


// 	// add flow elements and relations
// 	fpbjsJson_Process_Object.elementDataInformation.forEach(fileElement => {

// 		let element;

// 		switch (fileElement.$type) {
// 		case "fpb:Product":
// 			element = new fpb.Product(fileElement.id, fileElement.identification.shortName);
// 			break;
// 		case "fpb:Energy":
// 			element = new fpb.Energy(fileElement.id, fileElement.identification.shortName);
// 			break;
// 		case "fpb:Information":
// 			element = new fpb.Information(fileElement.id, fileElement.identification.shortName);
// 			break;
// 		case "fpb:ProcessOperator":
// 			element = new fpb.ProcessOperator(fileElement.id, fileElement.identification.shortName);
// 			break;
// 		case "fpb:TechnicalResource":
// 			element = new fpb.TechnicalResource(fileElement.id, fileElement.identification.shortName);
// 			break;
// 		case "fpb:Flow":
// 			element = new fpb.Flow(fileElement.id, "");
// 			break;
// 		case "fpb:Usage":
// 			element = new fpb.Usage(fileElement.id, "");
// 			break;
// 		case "fpb:ParallelFlow":
// 			element = new fpb.ParallelFlow(fileElement.id, "");
// 			break;
// 		case "fpb:AlternativeFlow":
// 			element = new fpb.AlternativeFlow(fileElement.id, "");
// 			break;
// 		default:
// 			break;
// 		}

// 		if (element instanceof fpb.FlowElement) {
// 			element.longName = fileElement.identification.longName;
// 			element.versionNumber = fileElement.identification.versionNumber;
// 			element.revisionNumber = fileElement.identification.revisionNumber;
// 		} else if (element instanceof fpb.Relation) {
// 			element.source = fileElement.sourceRef;
// 			element.target = fileElement.targetRef;
// 		}

// 		if (element instanceof fpb.ParallelFlow) {
// 			element.inTandemWith = fileElement.inTandemWith;
// 		}

// 		if (element instanceof (fpb.Product || fpb.Information || fpb.Energy)) {
// 			process.states.push(element);
// 		} else if (element instanceof fpb.ProcessOperator) {
// 			process.processOperators.push(element);
// 		} else if (element instanceof fpb.TechnicalResource) {
// 			process.resources.push(element);
// 		} else if (element instanceof fpb.Relation) {
// 			process.relations.push(element);
// 		}

// 	});



// 	// add flows to FlowElements and ProcessOperators
// 	process.relations.forEach(relation => {

// 		let source;
// 		let target;

// 		if (process.states.findIndex(source => source.id == relation.source) != -1) {
// 			source = process.states.find(source => source.id == relation.source);
// 		} else if (process.processOperators.findIndex(source => source.id == relation.source) != -1) {
// 			source = process.processOperators.find(source => source.id == relation.source);
// 		} else if (process.resources.findIndex(source => source.id == relation.source) != -1) {
// 			source = process.resources.find(source => source.id == relation.source);
// 		}

// 		if (process.states.findIndex(target => target.id == relation.target) != -1) {
// 			target = process.states.find(target => target.id == relation.target);
// 		} else if (process.processOperators.findIndex(target => target.id == relation.target) != -1) {
// 			target = process.processOperators.find(target => target.id == relation.target);
// 		} else if (process.resources.findIndex(target => target.id == relation.target) != -1) {
// 			target = process.resources.find(target => target.id == relation.target);
// 		}

// 		if (source === undefined) {
// 			console.error("ERROR: undefined state referenced by relation: " + relation.id);
// 		} else if (target === undefined) {
// 			console.error("ERROR: undefined target referenced by relation " + relation.id);
// 		} else {
// 			source.outgoingObjects.push(target.id);
// 			target.incomingObjects.push(source.id);
// 		}

// 	});

// 	// add onSystemBoarder Info
// 	process.states.forEach(state => {
// 		if (process.relations.findIndex(relation => state.id == relation.target) == -1 || process.relations.findIndex(relation => state.id == relation.source) == -1) {
// 			process.systemBoundary.onBoarder.push(state.id);
// 		}
// 	});


// 	return process;
// }

// function removeDuplicates(turtleString) {

// 	// split on punctuation and line ending
// 	let triples = turtleString.toString().split(".\n");

// 	// remove all tabs, leading and trailing whitespaces as well as linebraeaks from each entry of array
// 	for (let i = 0; i < triples.length; i++) {
// 		triples[i] = triples[i].replace(/(\r\n|\n|\r|\t|^[ \t]+|[ \t]+$)/gm, "");
// 	}
// 	// remove duplicates
// 	triples = Array.from(new Set(triples));

// 	// add punctiation again and one line break
// 	let rdf = "";
// 	triples.forEach(element => {
// 		let currentString = element;
// 		if (currentString != "") {
// 			currentString = element + ".";
// 			rdf = rdf + currentString + "\n";
// 		}
// 	});

// 	return rdf;
// }

// module.exports.mapJsonToRDF = mapJsonToRDF;

