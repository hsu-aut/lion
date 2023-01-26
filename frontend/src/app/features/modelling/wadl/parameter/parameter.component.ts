import { Component, Input } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { FormBuilder, Validators } from "@angular/forms";
import { take } from "rxjs";
import { TypeChangedEvent, WadlOption, WadlParameter, WadlParameterTypes, WadlTypesOfDataTypes } from "@shared/models/odps/wadl/WadlParameter";
import { WadlModelService } from "../../rdf-models/wadlModel.service";
import { toSparqlVariableList } from "../../utils/rxjs-custom-operators";
import { cValFns } from "../../utils/validators";

@Component({
    selector: 'wadl-parameter',
    templateUrl: './parameter.component.html',
    // styleUrls: ['../wadl.component.scss']
})
export class ParameterComponent {

    @Input() parameters = new Array<WadlParameter>();
    @Input() parentIri = "";

    ParamTypes = WadlParameterTypes;
    // Custom validator
    customVal = new cValFns();

    parameterTypes: Array<string> = [];

    parameterForm = this.fb.array(new Array<FormGroup<ParameterFormGroup>>())
    newParamTypeOfType = WadlTypesOfDataTypes.NonOntological;

    constructor(
        private fb: FormBuilder,
        private wadlService: WadlModelService,
    ) {}

    ngOnInit(): void {
        this.wadlService.getParameterTypes().pipe(take(1), toSparqlVariableList()).subscribe(data => {
            this.parameterTypes = data;
        });

        this.wadlService.getExistingParameters(this.parentIri).pipe(take(1)).subscribe(data => {
        // Fill form with existing parameters
            this.parameters.forEach(parameter => {
                const formEntry = this.createNewParameterFormEntry(parameter);
                this.parameterForm.push(formEntry);
                const lastAddedIndex = this.parameterForm.controls.length-1;
                this.parameterForm.at(lastAddedIndex).disable();
            });
            // Add one empty row
            this.parameterForm.push(this.createNewParameterFormEntry());
        });

    }

    setOntologicalDataType(typeChangedEvent: TypeChangedEvent): void {
        const fE = this.getLastFormEntry();
        fE.get("dataType").setValue(typeChangedEvent.type);
        this.newParamTypeOfType = typeChangedEvent.typeOfType;
    }

    removeDataType(): void {
        console.log("resetting");

        const fE = this.getLastFormEntry();
        fE.get("dataType").reset();
        this.newParamTypeOfType = WadlTypesOfDataTypes.NonOntological;
    }

    createNewParameterFormEntry(param?: WadlParameter): FormGroup<ParameterFormGroup> {
        const paramName = param?.name ?? "";
        const paramDataType = param?.dataType ?? "";
        const paramType = param?.type ?? null;
        const optionValues = param?.options?.map(opt=> opt?.value) ?? [];
        const defaultValue = param?.defaultValue ?? null;

        return this.fb.group<ParameterFormGroup>({
            name: this.fb.control(paramName, [this.customVal.noSpecialCharacters()]),
            type: this.fb.control(paramType, [Validators.required]),
            dataType: this.fb.control(paramDataType, [Validators.required]),
            required: this.fb.control(false),
            optionValues: this.fb.control(optionValues),
            defaultValue: this.fb.control(defaultValue),
        });
    }

    getLastFormEntry(): FormGroup<ParameterFormGroup> {
        const formLength = this.parameterForm.controls.length;
        return this.parameterForm.at(formLength-1);
    }

    addParameter() {
        // Disable entered value
        const formLength = this.parameterForm.controls.length;
        this.parameterForm.controls[formLength-1].disable();

        const fE = this.getLastFormEntry().value;
        const options = fE.optionValues.map(optionValue => new WadlOption(optionValue));
        const parameter = new WadlParameter(this.parentIri, fE.name, fE.type, fE.dataType, this.newParamTypeOfType, fE.defaultValue, fE.required, options);
        console.log(parameter);

        this.wadlService.addParameter(parameter).pipe(take(1)).subscribe(res => {
            // Create a new empty entry so that another param can be added
            const newEntry = this.createNewParameterFormEntry();
            this.parameterForm.push(newEntry);
        });
    // }
    }

    deleteParameter(i: number){
        const iriToDelete = this.parameters[i].parameterIri;
        this.wadlService.deleteParameter(iriToDelete).pipe(take(1)).subscribe();
        this.wadlService.getExistingParameters(this.parentIri).pipe(take(1)).subscribe(params => {
            // Reload parameters and remove form entry
            this.parameters = params;
            this.parameterForm.removeAt(i);
        });
    }
}


interface ParameterFormGroup {
    name: FormControl<string | null>,
    type: FormControl<WadlParameterTypes | null>,
    dataType: FormControl<string | null>,
    required: FormControl<boolean>,
    optionValues: FormControl<(number | string) [] | null>,
    defaultValue: FormControl<string | null>
}


// name: string;
// 	type: string;
// 	dataType: string;						// actual data type value (e.g. "string" or some IRI to an individual or class)
// 	typeOfDataType: WadlTypesOfDataTypes;	// simple data type, T-Box or A-Box?
// 	defaultValue?: any;
// 	required: boolean = false;
// 	options: WadlOption[] = new Array<WadlOption>()
