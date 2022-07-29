import { Component } from "@angular/core";
import { FormArray, FormBuilder, Validators } from "@angular/forms";
import { take } from "rxjs";
import { PrefixesService } from "../../../shared/services/prefixes.service";
import { WadlModelService } from "../../rdf-models/wadlModel.service";
import { WadlMethod } from "@shared/models/odps/wadl/WadlMethod";
import { WadlResponse } from "@shared/models/odps/wadl/WadlResponse";
import { cValFns } from "../../utils/validators";

@Component({
    selector: 'wadl-response',
    templateUrl: './response.component.html',
    // styleUrls: ['../wadl.component.scss']
})
export class ResponseComponent {

    // Custom validator
    customVal = new cValFns();

    responseForm = this.fb.group({
        resourceBasePath: ["", Validators.required],
        servicePath: ["", Validators.required],
        method: ["", Validators.required],
        responseCode: ["", Validators.required],
        responseFormRepresentationArray: this.fb.array([
            this.fb.control('')
        ]),
        bodyMediaType: ["", this.customVal.noSpecialCharacters()],
        bodyParameterKey: ["", this.customVal.noSpecialCharacters()],
        bodyDataType: ["", this.customVal.noSpecialCharacters()],
        ontologicalBodyDataType: [""],
        bodyOptionValue: ["", this.customVal.noSpecialCharacters()],
    })

    resourceBasePaths: Array<string> = [];
    servicePaths: Array<string> = [];
    methods: Array<string> = [];
    responseCodes: Array<string> = [];

    responseBodyRepresentationCheck;
    responseRepresentationTable: Array<Record<string, any>> = [];

    constructor(
        private fb: FormBuilder,
        private prefixService: PrefixesService,
        private wadlService: WadlModelService,
    ) {}


    get responseFormRepresentationArray(): FormArray {
        return this.responseForm.get('responseFormRepresentationArray') as FormArray;
    }

    setResponseFormRepresentation(table) {
        while (this.responseFormRepresentationArray.length !== 0) {
            this.responseFormRepresentationArray.removeAt(0);
        }
        for (let i = 0; i < table.length; i++) {
            this.responseFormRepresentationArray.push(this.fb.group({
                bodyMediaType: [table[i].bodyMediaType],
                bodyParameterKey: [table[i].bodyParameterKey],
                bodyDataType: [table[i].bodyDataType],
                bodyOptionValue: [table[i].bodyOptionValue],
            }));
        }
    }

    createResponseInsertString(): void {

    }

    deleteResponse(): void {

    }

    addResponse(): void {
        const serviceIri = this.prefixService.parseToIRI(this.responseForm.controls['servicePath'].value);
        const methodTypeIri = this.prefixService.parseToIRI(this.responseForm.controls['method'].value);
        const methodIri = serviceIri + "_" + this.prefixService.parseToName(this.responseForm.controls['method'].value);
        const method = new WadlMethod(serviceIri, methodTypeIri);

        const responseTypeIri = this.prefixService.parseToIRI(this.responseForm.controls['responseCode'].value);
        const responseIri = methodIri + "_Res" + this.prefixService.parseToName(this.responseForm.controls['responseCode'].value);
        const response = new WadlResponse(responseIri, responseTypeIri);

        // TODO: Pass proper data object instead of null and instead of modify, create separate methods in service
        this.wadlService.addResponse(method, response).pipe(take(1)).subscribe((data: any) => {
            // this.modelVariables = new WADLVARIABLES();
        });
    }

    addResponseRepresentationParameter(): void {

    }

    deleteResponseRepresentationParameter(): void {

    }

    createResponseRepresentationParameterInsertString(): void {
        const serviceIRI = this.prefixService.parseToIRI(this.responseForm.controls['servicePath'].value);
        const methodTypeIRI = this.prefixService.parseToIRI(this.responseForm.controls['method'].value);
        const methodIRI = serviceIRI + "_" + this.prefixService.parseToName(this.responseForm.controls['method'].value);
        const responseIRI = methodIRI + "_Res" + this.prefixService.parseToName(this.responseForm.controls['responseCode'].value);
        const responseTypeIRI = this.prefixService.parseToIRI(this.responseForm.controls['responseCode'].value);
        const bodyRepresentationMediaType = this.responseForm.controls['bodyMediaType'].value;
        const bodyRepresentationIRI = responseIRI + "_BodyRep_" + bodyRepresentationMediaType;
        const bodyRepresentationParameterKey = this.responseForm.controls['bodyParameterKey'].value;

        if (this.responseForm.controls['ontologicalBodyDataType'].value == "ontologicalDataTypeTBox") {
            const bodyRepresentationParameterDataTypeOntologicalTBox = this.prefixService.parseToIRI(this.responseForm.controls['bodyDataType'].value);
        } else if (this.responseForm.controls['ontologicalBodyDataType'].value == "ontologicalDataTypeABox") {
            const bodyRepresentationParameterDataTypeOntologicalABox = this.prefixService.parseToIRI(this.responseForm.controls['bodyDataType'].value);
        } else {
            const bodyRepresentationParameterDataType = this.responseForm.controls['bodyDataType'].value;
        }

        const bodyRepresentationParameterDataType = this.responseForm.controls['bodyDataType'].value;
        const bodyRepresentationParameterIRI = bodyRepresentationIRI + "_" + bodyRepresentationParameterKey;
        const bodyRepresentationParameterOptionValue = this.responseForm.controls['bodyOptionValue'].value;
        if (bodyRepresentationParameterOptionValue != "" && bodyRepresentationParameterOptionValue) {
            const bodyRepresentationParameterOptionIRI = bodyRepresentationParameterIRI + "_Option";
        }
        // TODO: Pass proper data object instead of null and instead of modify, create separate methods in service
        // this.wadlService.modifyResponse(null, null).pipe(take(1)).subscribe((data: any) => {
        //     this.getExistingResponseRepresentation();
        // });
    }

    getExistingServicesByBase(something: any) {
        // TODO: Check if inputs are needed and implement
    }

    getExistingResponseRepresentation() {
        const serviceIRI = this.prefixService.parseToIRI(this.responseForm.controls['servicePath'].value);
        const methodIRI = this.prefixService.parseToIRI(this.responseForm.controls['method'].value);
        this.wadlService.loadTABLE_OF_RESPONSE_REPRESENTATION(serviceIRI, methodIRI).pipe(take(1)).subscribe((data: any) => {
            this.responseRepresentationTable = data;
            this.setResponseFormRepresentation(this.responseRepresentationTable);
        });
    }

    setOntologicalDataType(something: string): void {
        // TODO: This should only be part of the modal
    }

    deleteParameter(context: string, parameterKey) {
        // switch (context) {
        // case "key": {
        //     this.modelVariables.parameterKey = parameterKey;
        //     this.wadlService.deleteParameter(this.modelVariables).pipe(take(1)).subscribe((data: any) => {
        //         this.loadingScreenService.stopLoading();
        //         this.modelVariables = new WADLVARIABLES();
        //         this.getExistingParameter(this.requestForm.controls['servicePath'].value, this.requestForm.controls['method'].value, this.requestForm.controls['parameterType'].value);
        //         this.getExistingRepresentation(this.requestForm.controls['servicePath'].value, this.requestForm.controls['method'].value, "request");
        //         this.getExistingRepresentation(this.responseForm.controls['servicePath'].value, this.responseForm.controls['method'].value, "response");
        //     });
        //     break;
        // }
        // case "option": {
        //     this.modelVariables.parameterKey = parameterKey;
        //     this.wadlService.deleteOption(this.modelVariables).pipe(take(1)).subscribe((data: any) => {
        //         this.loadingScreenService.stopLoading();
        //         this.modelVariables = new WADLVARIABLES();
        //         this.getExistingParameter(this.requestForm.controls['servicePath'].value, this.requestForm.controls['method'].value, this.requestForm.controls['parameterType'].value);
        //         this.getExistingRepresentation(this.requestForm.controls['servicePath'].value, this.requestForm.controls['method'].value, "request");
        //         this.getExistingRepresentation(this.responseForm.controls['servicePath'].value, this.responseForm.controls['method'].value, "response");
        //     });
        //     break;
        // }
        // }
    }

}
