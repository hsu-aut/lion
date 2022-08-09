import { Component } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { cValFns } from "../../utils/validators";

@Component({
    selector: 'wadl-representation',
    templateUrl: './representation.component.html',
    // styleUrls: ['../wadl.component.scss']
})
export class RepresentationComponent {

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
        private fb: FormBuilder
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
        console.log(newMediaType);

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
    }

    deleteRepresentation(representationIndex: number): void {
        // TODO: Delete via SPARQL
        this.bodyRepresentations.removeAt(representationIndex);

    }
}
