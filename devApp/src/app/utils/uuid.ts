import {v1} from 'uuid';

export class UUIDgen {

    generateFreshUUID(){
        var uuid = v1()
        return uuid;
    }

    generateFreshIRI(){
        var IRI = 'urn:uuid:' + this.generateFreshUUID();
        return IRI;
    }
}