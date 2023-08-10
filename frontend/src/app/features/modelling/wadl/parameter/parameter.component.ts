import { Component, Input } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { FormBuilder, Validators } from "@angular/forms";
import { take } from "rxjs";
import { TypeChangedEvent, WadlOption, WadlParameter, WadlParameterTypes, WadlTypesOfDataTypes } from "@shared/models/odps/wadl/WadlParameter";
import { WadlModelService } from "../../rdf-models/wadlModel.service";
import { cValFns } from "../../utils/validators";

@Component({
    selector: 'wadl-parameter',
    templateUrl: './parameter.component.html',
    // styleUrls: ['../wadl.component.scss']
})
export class ParameterComponent {

    @Input() parameters = new Array<WadlParameter>();
    private _parentIri = "";

    ParamTypes = WadlParameterTypes;
    paramTypeValues = Object.values(WadlParameterTypes).filter(val => typeof val === 'number');
    // Custom validator
    customVal = new cValFns();

    parameterForm = this.fb.array(new Array<FormGroup<ParameterFormGroup>>())
    newParamTypeOfType = WadlTypesOfDataTypes.NonOntological;

    constructor(
        private fb: FormBuilder,
        private wadlService: WadlModelService,
    ) {}


    @Input() set parentIri(value: string) {
        this._parentIri = value;
        this.loadExistingParameters();
    }

    ngOnInit(): void {
        this.loadExistingParameters();
    }

    loadExistingParameters() {
        this.wadlService.getExistingParameters(this._parentIri).pipe(take(1)).subscribe(parameters => {
            this.parameterForm = this.fb.array(new Array<FormGroup<ParameterFormGroup>>());
            this.parameters = parameters;
            parameters.forEach(parameter => {
                const formEntry = this.createNewParameterFormEntry(parameter);
                this.parameterForm.push(formEntry);
                const lastAddedIndex = this.parameterForm.controls.length-1;
                this.parameterForm.at(lastAddedIndex).disable();
            });
            // Add one empty row
            this.parameterForm.push(this.createNewParameterFormEntry());
        });
    }

    getParamControl(index: number, key: string) {
        const paramGroup = this.parameterForm.at(index) as FormGroup<ParameterFormGroup>;
        return paramGroup.get(key) as FormControl;
    }

    setOntologicalDataType(typeChangedEvent: TypeChangedEvent): void {
        const fE = this.getLastFormEntry();
        fE.get("dataType").setValue(typeChangedEvent.type);
        this.newParamTypeOfType = typeChangedEvent.typeOfType;
    }

    removeDataType(): void {
        const fE = this.getLastFormEntry();
        this.newParamTypeOfType = WadlTypesOfDataTypes.NonOntological;
    }

    createNewParameterFormEntry(param?: WadlParameter): FormGroup<ParameterFormGroup> {
        const paramName = param?.name ?? "";
        const paramDataType = param?.dataType ?? "";
        const paramType = param?.type ?? null;

        const optionValues = param?.options?.map(option => option.value).join(',') ?? "";
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

    addParameter(): void {
        // Disable entered value
        const formLength = this.parameterForm.controls.length;
        this.parameterForm.controls[formLength-1].disable();

        const fE = this.getLastFormEntry().value;
        // create option inputs as Array
        const optionInput = fE.optionValues.split(",");
        const options = optionInput.map(optionEntry => {
            optionEntry = optionEntry.trim();
            return new WadlOption(optionEntry);
        });
        const parameter = new WadlParameter(this._parentIri, fE.name, fE.type, fE.dataType, this.newParamTypeOfType, fE.defaultValue, fE.required, options);

        this.wadlService.addParameter(parameter).pipe(take(1)).subscribe(res => {
            // Create a new empty entry so that another param can be added
            this.parameters.push(parameter);
            const newEntry = this.createNewParameterFormEntry();
            this.parameterForm.push(newEntry);
        });
    }

    deleteParameter(i: number): void {
        const iriToDelete = this.parameters[i].parameterIri;
        this.wadlService.deleteParameter(iriToDelete).pipe(take(1)).subscribe();
        this.wadlService.getExistingParameters(this._parentIri).pipe(take(1)).subscribe(params => {
            // Reload parameters and remove form entry
            this.parameters = params;
            this.parameterForm.removeAt(i);
        });
    }
}


type ParameterFormGroup = {
    name: FormControl<string | null>,
    type: FormControl<WadlParameterTypes | null>,
    dataType: FormControl<string | null>,
    required: FormControl<boolean>,
    optionValues: FormControl<string | null>,
    defaultValue: FormControl<string | null>
}
