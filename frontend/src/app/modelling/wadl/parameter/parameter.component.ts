import { Component, Input } from "@angular/core";
import { FormArray, FormGroup } from "@angular/forms";
import { FormBuilder, Validators } from "@angular/forms";
import { take } from "rxjs";
import { WadlParameter } from "../../../../../models/odps/wadl/WadlParameter";
import { WadlModelService } from "../../rdf-models/wadlModel.service";
import { toSparqlVariableList } from "../../utils/rxjs-custom-operators";
import { cValFns } from "../../utils/validators";

@Component({
    selector: 'wadl-parameter',
    templateUrl: './parameter.component.html',
    // styleUrls: ['../wadl.component.scss']
})
export class ParameterComponent {

    @Input() parameters: Array<WadlParameter>;

    // Custom validator
    customVal = new cValFns();

    parameterTypes: Array<string> = [];

    parameterForm = this.fb.array([
        this.createNewParameterFormEntry()
    ])


    constructor(
        private fb: FormBuilder,
        private wadlService: WadlModelService,
    ) {}

    ngOnInit(): void {
        this.wadlService.getParameterTypes().pipe(take(1), toSparqlVariableList()).subscribe(data => {
            this.parameterTypes = data;
        });
        this.parameterForm.patchValue(this.parameters);
    }

    setOntologicalDataType(asd: string): void {
        // TODO: Should only be in modal
    }

    createNewParameterFormEntry(): FormGroup {
        return this.fb.group({
            parameterName: ["", this.customVal.noSpecialCharacters()],
            parameterType: ["", Validators.required],
            dataType: ["", this.customVal.noSpecialCharacters()],
            ontologicalDataType: [""],
            optionValue: ["", this.customVal.noSpecialCharacters()],
        });
    }

    addParameter() {
        // TODO: Send request to really add the parameter

        // Disable entered value
        const formLength = this.parameterForm.controls.length;
        this.parameterForm.controls[formLength-1].disable();

        // Create a new empty entry so that another param can be added
        const newEntry = this.createNewParameterFormEntry();
        this.parameterForm.push(newEntry);
    }

    deleteParameter(i: number){
        // TODO: Send request to really delete the parameter

        // Remove line
        this.parameterForm.removeAt(i);
    }
}
