import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { take } from "rxjs";
import { PrefixesService } from "../../../shared/services/prefixes.service";
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
    ontologicalDataTypeRadio;
    _OntologicalDataType: string;

    ontologicalDataType = this.fb.group({
        TBox: [undefined, Validators.required],
        type: [undefined, Validators.required],
        individual: [undefined]
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

    getExistingClasses(owlEntity) {
        if (owlEntity) {
            this.wadlService.loadLIST_ONTOLOGICAL_TYPES_BY_NAMESPACE(owlEntity).pipe(take(1)).subscribe((data: any) => {
                this.classes = data;
            });
        }
    }

    getExistingIndividuals(owlClass: string) {
        owlClass = this.prefixService.parseToIRI(owlClass);
        this.tBoxService.getListOfIndividualsByClass(owlClass, "http://www.hsu-ifa.de/ontologies/WADL#").pipe(take(1))
            .subscribe((data: any) => {
                this.individuals = data;
            });
    }

    setOntologicalDataType(context: string) {
        this._OntologicalDataType = context;
    }

    setDataType(IRI, type) {
        switch (this._OntologicalDataType) {
        case "requestParameter": {
            // TODO: Set types to request form. This is better done via a service or other inter-component communication
            // if (IRI) {
            //     this.requestForm.controls['dataType'].setValue(IRI);
            //     this.requestForm.controls['ontologicalDataType'].setValue(type);
            // } else {
            //     this.requestForm.controls['dataType'].setValue(IRI);
            //     this.requestForm.controls['ontologicalDataType'].setValue(IRI);
            // }
            break;
        }
        case "requestBodyParameter": {
            // TODO: Set body types to request form. This is better done via a service or other inter-component communication
            // if (IRI) {
            //     this.requestForm.controls['bodyDataType'].setValue(IRI);
            //     this.requestForm.controls['ontologicalBodyDataType'].setValue(type);
            // } else {
            //     this.requestForm.controls['bodyDataType'].setValue(IRI);
            //     this.requestForm.controls['ontologicalBodyDataType'].setValue(IRI);
            // }
            break;
        }
        case "responseBodyParameter": {
            // TODO: Set response body types to request form. This is better done via a service or other inter-component communication
            // if (IRI) {
            //     this.responseForm.controls['bodyDataType'].setValue(IRI);
            //     this.responseForm.controls['ontologicalBodyDataType'].setValue(type);
            // } else {
            //     this.responseForm.controls['bodyDataType'].setValue(IRI);
            //     this.responseForm.controls['ontologicalBodyDataType'].setValue(IRI);
            // }
            break;
        }
        }
    }
}
