import { Component, Input } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { WadlRepresentation } from "@shared/models/odps/wadl/WadlRepresentation";
import { WadlModelService } from "../../rdf-models/wadlModel.service";
import { cValFns } from "../../utils/validators";
import { Observable } from "rxjs";

@Component({
    selector: 'wadl-representation',
    templateUrl: './representation.component.html',
    // styleUrls: ['../wadl.component.scss']
})
export class RepresentationComponent {

    _parentIri: string;
    representations$: Observable<WadlRepresentation[]>;

    // Custom validator
    customVal = new cValFns();

    // MediaType of the new body rep
    newBodyRepresentationMediaType: string;

    constructor(
        private fb: FormBuilder,
        private wadlService: WadlModelService
    ) {}


    @Input() set parentIri(value: string) {
        this._parentIri = value;
        this.representations$ = this.wadlService.getRepresentations(this._parentIri);
    }

    addRepresentation(): void{
        const newMediaType = this.newBodyRepresentationMediaType;

        // TODO: Really add representation
        console.log(this._parentIri);

        const representation = new WadlRepresentation(this._parentIri, newMediaType);
        console.log(representation);

        this.wadlService.addRepresentation(representation);
    }

    deleteRepresentation(representationIndex: number): void {
        // TODO: Delete via SPARQL

    }
}
