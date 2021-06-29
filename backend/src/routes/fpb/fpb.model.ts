export abstract class FpbBaseElement {
	constructor(public id: string, public shortName: string) {}
}

export class Fpb_Object extends FpbBaseElement{
	constructor(id: string, shortName: string, public longName = "", public versionNumber = "", public revisionNumber = "") {
		super(id, shortName);
	}
}

export class FlowElement extends Fpb_Object {
	incomingObjects = [];
	outgoingObjects = [];
	
	constructor(id: string, shortName: string) {
		super(id, shortName);
	}
}

export class Project extends FpbBaseElement {
	process = {};

	constructor(id: string, shortName: string) {
		super(id, shortName);
	}

}

export class Process extends Fpb_Object {
	states = [];
	resources = [];
	systemBoundary: SystemBoundary;
	processOperators = [];
	relations = [];
	isDecomposedProcessOperator = false;

	constructor(id: string, shortName: string) {
		super(id, shortName);
	}

	addState(productEnergyInformation): void {
		this.states.push(productEnergyInformation);
	}

	addResource(technicalResource): void {
		this.resources.push(technicalResource);
	}
	addProcessOperator(processOperator) {
		this.processOperators.push(processOperator);
	}
	addRelation(relation) {
		this.relations.push(relation);
	}
}

export class SystemBoundary extends Fpb_Object {
	onBoarder = [];

	constructor(id: string, shortName: string) {
		super(id, shortName);
	}

}

export class Product extends FlowElement {
	constructor(id: string, shortName: string) {
		super(id, shortName);
	}
}

export class Energy extends FlowElement {
	constructor(id: string, shortName: string) {
		super(id, shortName);
	}
}

export class Information extends FlowElement {
	constructor(id: string, shortName: string) {
		super(id, shortName);
	}
}


export class States {
	constructor(public arrayOfPEI) {
	}
}

export class ProcessOperator extends FlowElement {
	constructor(id: string, shortName: string) {
		super(id, shortName);
	}
}


export class TechnicalResource extends FlowElement {
	constructor(id: string, shortName: string) {
		super(id, shortName);
	}
}


export class Relation extends Fpb_Object {
	source = "";
	target = "";

	constructor(id: string, shortName: string) {
		super(id, shortName);
	}
}
export class Flow extends Relation {
	constructor(id: string, shortName: string) {
		super(id, shortName);
	}
}
export class ParallelFlow extends Relation {
	inTandemWith = [];
	
	constructor(id: string, shortName: string) {
		super(id, shortName);
	}
}
export class AlternativeFlow extends Relation {
	inTandemWith = [];
	
	constructor(id: string, shortName: string) {
		super(id, shortName);
	}
}
export class Usage extends Relation {
	constructor(id: string, shortName: string) {
		super(id, shortName);
	}
}
