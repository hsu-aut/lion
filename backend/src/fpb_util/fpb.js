class Fpb_Object {
    constructor(id, shortName) {
        this.id = id;
        this.shortName = shortName;
        this.longName = "";
        this.versionNumber = "";
        this.revisionNumber = "";
    }
}

class FlowElement extends Fpb_Object {
    constructor(id, shortName) {
        super(id, shortName)
        this.incomingObjects = [];
        this.outgoingObjects = [];
    }
}

class Project {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.process = {};
    }

}

class Process extends Fpb_Object {
    constructor(id, shortName) {
        super(id, shortName)
        this.states = [];
        this.resources = [];
        this.systemBoundary = {};
        this.processOperators = [];
        this.relations = [];
    }

    addState(productEnergyInformation) {
        this.states.push(productEnergyInformation)
    }

    addResource(technicalResource) {
        this.resources.push(technicalResource)
    }
    addProcessOperator(processOperator) {
        this.processOperators.push(processOperator)
    }
    addRelation(relation) {
        this.relations.push(relation)
    }
}

class SystemBoundary extends Fpb_Object {
    constructor(id, shortName) {
        super(id, shortName)
        this.onBoarder = [];
    }

}

class Product extends FlowElement {
    constructor(id, shortName) {
        super(id, shortName)
    }
}

class Energy extends FlowElement {
    constructor(id, shortName) {
        super(id, shortName)
    }
}

class Information extends FlowElement {
    constructor(id, shortName) {
        super(id, shortName)
    }
}


class States {
    constructor(arrayOfPEI) {
        this.arrayOfPEI = arrayOfPEI
    }
}

class ProcessOperator extends FlowElement {
    constructor(id, shortName) {
        super(id, shortName)
    }
}


class TechnicalResource extends FlowElement {
    constructor(id, shortName) {
        super(id, shortName)
    }
}


class Relation extends Fpb_Object {
    constructor(id, shortName) {
        super(id, shortName)
        this.source = "";
        this.target = "";
    }
}
class Flow extends Relation {
    constructor(id, shortName) {
        super(id, shortName)
    }
}
class ParallelFlow extends Relation {
    constructor(id, shortName) {
        super(id, shortName)
        this.inTandemWith = [];
    }
}
class AlternativeFlow extends Relation {
    constructor(id, shortName) {
        super(id, shortName)
        this.inTandemWith = [];
    }
}
class Usage extends Relation {
    constructor(id, shortName) {
        super(id, shortName)
    }
}

module.exports.Relation = Relation;
module.exports.FlowElement = FlowElement;
module.exports.Project = Project;
module.exports.Process = Process;
module.exports.Product = Product;
module.exports.Energy = Energy;
module.exports.Information = Information;
module.exports.SystemBoundary = SystemBoundary;
module.exports.States = States;
module.exports.ProcessOperator = ProcessOperator;
module.exports.TechnicalResource = TechnicalResource;
module.exports.Flow = Flow;
module.exports.Usage = Usage;
module.exports.ParallelFlow = ParallelFlow;
module.exports.AlternativeFlow = AlternativeFlow;
