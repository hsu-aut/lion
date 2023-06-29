import { Component, Input } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { WadlRepresentation } from "@shared/models/odps/wadl/WadlRepresentation";
import { WadlModelService } from "../../rdf-models/wadlModel.service";
import { cValFns } from "../../utils/validators";
import { Observable, take, withLatestFrom } from "rxjs";

@Component({
    selector: 'wadl-representation',
    templateUrl: './representation.component.html',
    // styleUrls: ['../wadl.component.scss']
})
export class RepresentationComponent {

    _parentIri: string;
    representations$: Observable<WadlRepresentation[]>;

    // MediaType of the new body rep
    mediaTypeInput = this.fb.control("", Validators.required)

    constructor(
        private fb: FormBuilder,
        private wadlService: WadlModelService
    ) {}


    @Input() set parentIri(value: string) {
        this._parentIri = value;
        this.representations$ = this.wadlService.getRepresentations(this._parentIri);
    }

    /**
     * Adds a new representation with the given media type to the current parent element
     */
    addRepresentation(): void{
        const newMediaType = this.mediaTypeInput.value;
        const representation = new WadlRepresentation(this._parentIri, newMediaType);
        try {
            this.wadlService.addRepresentation(representation);
        } catch (error) {
            console.log("Error while adding representation");
        } finally {
            this.mediaTypeInput.reset();
        }
    }

    /**
     * Deletes a representation specifiec by its representation IRI
     * @param representationIri IRI of the representation to delete
     */
    deleteRepresentation(representationIri: string): void {
        this.wadlService.deleteRepresentation(representationIri);
    }
}
