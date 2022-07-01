import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, Validators } from "@angular/forms";
import { take } from "rxjs";
import { PrefixesService } from "../../../shared/services/prefixes.service";
import { WadlModelService } from "../../rdf-models/wadlModel.service";
import { toSparqlTable } from "../../utils/rxjs-custom-operators";
import { cValFns } from "../../utils/validators";

@Component({
    selector: 'wadl-request',
    templateUrl: './request.component.html',
    // styleUrls: ['../wadl.component.scss']
})
export class RequestComponent {

    requestBodyRepresentationCheck;

    // Custom validator
    customVal = new cValFns();

    requestForm = this.fb.group({
        resourceBasePath: [undefined, Validators.required],
        servicePath: [undefined, Validators.required],
        method: [undefined, Validators.required],
        parameterType: [undefined, Validators.required],
        requestFormParameterArray: this.fb.array([
            this.fb.control('')
        ]),
        parameterKey: [undefined, this.customVal.noSpecialCharacters],
        dataType: [undefined, this.customVal.noSpecialCharacters],
        ontologicalDataType: [undefined],
        optionValue: [undefined, this.customVal.noSpecialCharacters],
        requestFormRepresentationArray: this.fb.array([
            this.fb.control('')
        ]),
        bodyMediaType: [undefined, this.customVal.noSpecialCharacters],
        bodyParameterKey: [undefined, this.customVal.noSpecialCharacters],
        bodyDataType: [undefined, this.customVal.noSpecialCharacters],
        ontologicalBodyDataType: [undefined],
        bodyOptionValue: [undefined, this.customVal.noSpecialCharacters],
    })

    resourceBasePaths: Array<string> = [];
    servicePaths: Array<string> = [];
    methods: Array<string> = [];
    parameterTypes: Array<string> = [];
    requestParameterTable: Array<Record<string, any>> = [];
    requestRepresentationTable: Array<Record<string, any>> = [];

    constructor(
        private fb: FormBuilder,
        private prefixService: PrefixesService,
        private wadlService: WadlModelService,
    ) {}


    getExistingServicesByBase(selectedResourceBasePath) {
        // this method should get the existing services per base path as list
        if (selectedResourceBasePath) {
            selectedResourceBasePath = this.prefixService.parseToIRI(selectedResourceBasePath);
            this.wadlService.getServicesByBase(selectedResourceBasePath).pipe(take(1)).subscribe((data: any) => {
                this.servicePaths = data;
            });
        }
    }

    // form array utils
    get requestFormParameterArray() {
        return this.requestForm.get('requestFormParameterArray') as FormArray;
    }
    setRequestFormParameter(table) {
        while (this.requestFormParameterArray.length !== 0) {
            this.requestFormParameterArray.removeAt(0);
        }
        for (let i = 0; i < table.length; i++) {
            this.requestFormParameterArray.push(this.fb.group({
                parameterKey: [table[i].parameterKey],
                dataType: [table[i].dataType],
                optionValue: [table[i].optionValue]
            }));
        }
    }
    get requestFormRepresentationArray() {
        return this.requestForm.get('requestFormRepresentationArray') as FormArray;
    }

    setRequestFormRepresentation(table) {
        while (this.requestFormRepresentationArray.length !== 0) {
            this.requestFormRepresentationArray.removeAt(0);
        }
        for (let i = 0; i < table.length; i++) {
            this.requestFormRepresentationArray.push(this.fb.group({
                bodyMediaType: [table[i].bodyMediaType],
                bodyParameterKey: [table[i].bodyParameterKey],
                bodyDataType: [table[i].bodyDataType],
                bodyOptionValue: [table[i].bodyOptionValue],
            }));
        }
    }

    getExistingParameter(servicePath, method, parameterType) {
        // this method should get the existing parameter table
        this.requestForm.controls['parameterKey'].reset();
        this.requestForm.controls['dataType'].reset();
        this.requestForm.controls['optionValue'].reset();
        if (parameterType == "none") {
            this.setRequestFormParameter([]);
        } else if (servicePath && method && parameterType) {
            const serviceIri = this.prefixService.parseToIRI(servicePath);
            const methodTypeIri = this.prefixService.parseToIRI(method);
            const parameterTypeIri = this.prefixService.parseToIRI(parameterType);
            this.wadlService.getRequestParameters(serviceIri, methodTypeIri, parameterTypeIri).pipe(take(1), toSparqlTable())
                .subscribe((data: any) => {
                    this.requestParameterTable = data;
                    this.setRequestFormParameter(this.requestParameterTable);
                });
        }
    }

    // TODO: Add separate methods for delete and build
    createRequestParameter(action:string): void {
        if(this.requestForm.valid) {
            const serviceIRI = this.prefixService.parseToIRI(this.requestForm.controls['servicePath'].value);
            const methodTypeIRI = this.prefixService.parseToIRI(this.requestForm.controls['method'].value);
            const methodIRI = serviceIRI + "_" + this.prefixService.parseToName(this.requestForm.controls['method'].value);
            const requestIRI = methodIRI + "_Req";
            let parameterIri = "";
            if (this.requestForm.controls['parameterType'].value != "none" && this.requestForm.controls['parameterKey'].value != "") {
                const parameterKey = this.requestForm.controls['parameterKey'].value;
                parameterIri = requestIRI + "_" + parameterKey;
                const parameterTypeIRI = this.prefixService.parseToIRI(this.requestForm.controls['parameterType'].value);
            }
            if (this.requestForm.controls['ontologicalDataType'].value == "ontologicalDataTypeTBox") {
                const parameterDataTypeTBox = this.prefixService.parseToIRI(this.requestForm.controls['dataType'].value);
            } else if (this.requestForm.controls['ontologicalDataType'].value == "ontologicalDataTypeABox") {
                const parameterDataTypeABox = this.prefixService.parseToIRI(this.requestForm.controls['dataType'].value);
            } else {
                const parameterDataType = this.requestForm.controls['dataType'].value;
            }
            const optionValue = this.requestForm.controls['optionValue'].value;
            if (optionValue) {
                const optionIRI = parameterIri + "_Option";
            }


            // TODO: Pass proper data object
            this.wadlService.modifyRequest("asd", action).pipe(take(1)).subscribe((data: any) => {
                // this.loadDynamicDropdowns();
                // this.loadDynamicTables();
                this.getExistingParameter(this.requestForm.controls['servicePath'].value, this.requestForm.controls['method'].value, this.requestForm.controls['parameterType'].value);
            });
        }
    }

    createRequestRepresentationParameter(action: string): void {
        if(this.requestForm.valid) {
            const serviceIRI = this.prefixService.parseToIRI(this.requestForm.controls['servicePath'].value);
            const methodTypeIRI = this.prefixService.parseToIRI(this.requestForm.controls['method'].value);
            const methodIRI = serviceIRI + "_" + this.prefixService.parseToName(this.requestForm.controls['method'].value);
            const requestIRI = methodIRI + "_Req";
            const bodyRepresentationMediaType = this.requestForm.controls['bodyMediaType'].value;
            const bodyRepresentationIRI = requestIRI + "_BodyRep_" + bodyRepresentationMediaType;
            const bodyRepresentationParameterKey = this.requestForm.controls['bodyParameterKey'].value;

            if (this.requestForm.controls['ontologicalBodyDataType'].value == "ontologicalDataTypeTBox") {
                const bodyRepresentationParameterDataTypeOntologicalTBox = this.prefixService.parseToIRI(this.requestForm.controls['bodyDataType'].value);
            } else if (this.requestForm.controls['ontologicalBodyDataType'].value == "ontologicalDataTypeABox") {
                const bodyRepresentationParameterDataTypeOntologicalABox = this.prefixService.parseToIRI(this.requestForm.controls['bodyDataType'].value);
            } else {
                const bodyRepresentationParameterDataType = this.requestForm.controls['bodyDataType'].value;
            }

            const bodyRepresentationParameterDataType = this.requestForm.controls['bodyDataType'].value;
            const bodyRepresentationParameterIRI = bodyRepresentationIRI + "_" + bodyRepresentationParameterKey;
            const bodyRepresentationParameterOptionValue = this.requestForm.controls['bodyOptionValue'].value;
            if (bodyRepresentationParameterOptionValue != "" && bodyRepresentationParameterOptionValue) {
                const bodyRepresentationParameterOptionIRI = bodyRepresentationParameterIRI + "_Option";
            }
            // TODO: Pass proper data object
            this.wadlService.modifyRequest("asd", action).pipe(take(1)).subscribe((data: any) => {
                this.getExistingRequestRepresentation();
            });
        }
    }

    getExistingRequestRepresentation() {
        // this method should get the existing parameter table
        const serviceIRI = this.prefixService.parseToIRI(this.requestForm.controls['servicePath'].value);
        const methodIRI = this.prefixService.parseToIRI(this.requestForm.controls['method'].value);
        this.wadlService.loadTABLE_OF_REQUEST_REPRESENTATION(serviceIRI, methodIRI).pipe(take(1)).subscribe((data: any) => {
            this.requestRepresentationTable = data;
            this.setRequestFormRepresentation(this.requestRepresentationTable);
        });
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


    setOntologicalDataType(asd: string): void {
        // TODO: Should only be in modal
    }
}
