import { Component, Input } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { WadlRepresentation } from "@shared/models/odps/wadl/WadlRepresentation";
import { WadlModelService } from "../../rdf-models/wadlModel.service";
import { cValFns } from "../../utils/validators";

@Component({
    selector: 'wadl-representation',
    templateUrl: './representation.component.html',
    // styleUrls: ['../wadl.component.scss']
})
export class RepresentationComponent {

    @Input("parentIri") parentIri: string;

    // Custom validator
    customVal = new cValFns();

    // MediaType of the new body rep
    newBodyRepresentationMediaType: string;

    bodyRepresentations = this.fb.array<FormGroup<{
        mediaType: FormControl<string | null>,
        parameters: FormArray<FormGroup<{
            parameterName: FormControl<string | null>,
            dataType: FormControl<string | null>,
            ontologicalDataType: FormControl<string | null>,
            optionValue: FormControl<string | null>,
        }>>
    }>>([])

    constructor(
        private fb: FormBuilder,
        private wadlService: WadlModelService
    ) {
        console.log("construct rep");
    }

    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        console.log("rep init");

    }

    addRepresentation(): void{
        const newMediaType = this.newBodyRepresentationMediaType;

        this.bodyRepresentations.push(this.fb.group({
            mediaType: [newMediaType, this.customVal.noSpecialCharacters()],
            parameters: this.fb.array([
                this.fb.group({
                    parameterName: ["", this.customVal.noSpecialCharacters()],
                    dataType: ["", this.customVal.noSpecialCharacters()],
                    ontologicalDataType: [""],
                    optionValue: ["", this.customVal.noSpecialCharacters()],
                })
            ])
        }));

        // TODO: Really add representation
        const representation = new WadlRepresentation(this.parentIri, newMediaType);
        this.wadlService.addRepresentation(representation);
    }

    deleteRepresentation(representationIndex: number): void {
        // TODO: Delete via SPARQL
        this.bodyRepresentations.removeAt(representationIndex);

    }
}
