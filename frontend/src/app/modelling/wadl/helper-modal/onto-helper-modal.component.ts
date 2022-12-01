import { Component, EventEmitter, Output } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { TypeChangedEvent, WadlTypesOfDataTypes } from "@shared/models/odps/wadl/WadlParameter";
import { PrefixesService, Prefix } from "../../../shared/services/prefixes.service";
import { TboxService } from "../../rdf-models/tbox.service";

@Component({
    selector: 'onto-helper-modal',
    templateUrl: './onto-helper-modal.component.html',
    // styleUrls: ['../wadl.component.scss']
})
export class OntoHelperModalComponent {

    @Output("onTypeSelected") onTypeSelected = new EventEmitter<TypeChangedEvent>();
    @Output("onTypeRemoved") onTypeRemoved = new EventEmitter<void>();

    TypesOfDataTypes = WadlTypesOfDataTypes;                                            // Helper to use enum in HTML
    ontologicalDataTypeRadio: WadlTypesOfDataTypes = WadlTypesOfDataTypes.TBox;         // Radio selector

    prefixes: Prefix[]
    selectedPrefix = this.prefixService.getPrefixes().find(pD => pD.prefix == "wadl");
    classes: Array<string> = [];
    individuals: Array<string> = [];

    dataTypeForm = this.fb.group({
        namespace: [this.selectedPrefix , Validators.required],
        class: ["", Validators.required],
        individual: [""]
    })

    constructor(
        private fb: FormBuilder,
        private tBoxService: TboxService,
        private prefixService: PrefixesService
    ) {}

    ngOnInit(): void {
        this.prefixes = this.prefixService.getPrefixes();
        this.dataTypeForm.controls.namespace.valueChanges.subscribe(pD => {
            this.selectedPrefix = pD;
            this.getClassesOfNamespace(pD);
        });

        this.dataTypeForm.controls.class.valueChanges.subscribe(cls => {
            this.getExistingIndividuals(cls);
        });
    }

    /**
     * Loads all classes defined in a certain namespace
     * @param selectedPrefix
     */
    private getClassesOfNamespace(selectedPrefix: Prefix): void {
        const namespace = selectedPrefix.namespace;
        this.tBoxService.getClassesWithinNamespace(namespace).subscribe(classes => this.classes = classes);
    }

    /**
     * Gets all individuals of a certain class defined in a certain namespace
     * @param cls Class to get individuals of
     */
    private getExistingIndividuals(cls: string): void {
        // TODO: This namespace should be the currently active modeling namespace and not the same of the class...
        this.tBoxService.getListOfIndividualsByClass(cls, this.selectedPrefix.namespace).subscribe(individuals => this.individuals = individuals);
    }

    /**
     * On clicking the modal's "confirm" button, the selected value should be emitted to the parent element
     */
    setParameterType(): void {
        let typeChangedEvent: TypeChangedEvent;

        let selectedType = "";
        if(this.ontologicalDataTypeRadio == WadlTypesOfDataTypes.TBox) {
            selectedType = this.dataTypeForm.controls.class.value;
            typeChangedEvent = new TypeChangedEvent(selectedType, WadlTypesOfDataTypes.TBox);
        }
        if(this.ontologicalDataTypeRadio == WadlTypesOfDataTypes.ABox) {
            selectedType = this.dataTypeForm.controls.individual.value;
            typeChangedEvent = new TypeChangedEvent(selectedType, WadlTypesOfDataTypes.ABox);
        }
        this.onTypeSelected.emit(typeChangedEvent);
    }

    setNormalDataType(): void {
        this.onTypeRemoved.emit();
    }


}
