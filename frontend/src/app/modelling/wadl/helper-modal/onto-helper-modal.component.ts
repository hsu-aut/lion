import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { take } from "rxjs";
import { WadlTypesOfDataTypes } from "@shared/models/odps/wadl/WadlParameter";
import { PrefixesService, Prefix, DefaultNamespaces } from "../../../shared/services/prefixes.service";
import { TboxService } from "../../rdf-models/tbox.service";
import { WadlModelService } from "../../rdf-models/wadlModel.service";

@Component({
    selector: 'onto-helper-modal',
    templateUrl: './onto-helper-modal.component.html',
    // styleUrls: ['../wadl.component.scss']
})
export class OntoHelperModalComponent {

    requestBodyRepresentationCheck;
    requestBodyRepresentationRadio;

    TypesOfDataTypes = WadlTypesOfDataTypes;
    ontologicalDataTypeRadio: WadlTypesOfDataTypes = WadlTypesOfDataTypes.TBox;

    prefixes: Prefix[]

    _OntologicalDataType: string;

    dataTypeForm = this.fb.group({
        namespace: [DefaultNamespace , Validators.required],
        class: ["", Validators.required],
        individual: [""]
    })

    tboxes: Array<string> = [];
    classes: Array<string> = [];
    individuals: Array<string> = [];

    constructor(
        private fb: FormBuilder,
        private wadlService: WadlModelService,
        private tBoxService: TboxService,
        private prefixService: PrefixesService
    ) {

    }

    changeTypeOfOntologicalDataType(): void {
        this.prefixes = this.prefixService.getPrefixes();
    }

    getExistingClassesOfPrefix(): void {
        const prefixObject = this.dataTypeForm.get("namespace").value;
        this.tBoxService.getClassesWithinNamespace(prefixObject.)
    }

    getExistingIndividuals(): void {
        const owlClass = this.dataTypeForm.get("class").value;
        // owlClass = this.prefixService.parseToIRI(owlClass);
        this.tBoxService.getListOfIndividualsByClass(owlClass, "http://www.hsu-ifa.de/ontologies/WADL#").pipe(take(1))
            .subscribe((data: any) => {
                this.individuals = data;
            });
    }

    setParameterType() {

    }


}
