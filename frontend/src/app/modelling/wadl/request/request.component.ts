import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, Validators } from "@angular/forms";
import { take } from "rxjs";
import { WadlBaseResource } from "@shared/models/odps/wadl/BaseResource";
import { PrefixesService } from "../../../shared/services/prefixes.service";
import { WadlModelService } from "../../rdf-models/wadlModel.service";
import { toSparqlTable, toSparqlVariableList } from "../../utils/rxjs-custom-operators";
import { cValFns } from "../../utils/validators";
import { SparqlResponse } from "@shared/models/sparql/SparqlResponse";
import { WadlResource } from "@shared/models/odps/wadl/Resource";
import { WadlRequest } from "@shared/models/odps/wadl/WadlRequest";
import { WadlTypesOfDataTypes } from "@shared/models/odps/wadl/WadlParameter";
import { WadlMethod } from "@shared/models/odps/wadl/WadlMethod";

@Component({
    selector: 'wadl-request',
    templateUrl: './request.component.html',
    // styleUrls: ['../wadl.component.scss']
})
export class RequestComponent implements OnInit {

    requestBodyRepresentationCheck;

    // Custom validator
    customVal = new cValFns();

    requestForm = this.fb.group({
        resourceBasePath: [undefined, Validators.required],
        resourcePath: [undefined, Validators.required],
        method: [undefined, Validators.required],
        parameterType: [undefined, Validators.required],
        requestFormParameterArray: this.fb.array([
            this.fb.control('')
        ]),
        parameterName: [undefined, this.customVal.noSpecialCharacters],
        dataType: [undefined, this.customVal.noSpecialCharacters],
        ontologicalDataType: [undefined],
        optionValue: [undefined, this.customVal.noSpecialCharacters],
        requestFormRepresentationArray: this.fb.array([
            this.fb.control('')
        ]),
        bodyMediaType: [undefined, this.customVal.noSpecialCharacters],
        bodyParameterName: [undefined, this.customVal.noSpecialCharacters],
        bodyDataType: [undefined, this.customVal.noSpecialCharacters],
        ontologicalBodyDataType: [undefined],
        bodyOptionValue: [undefined, this.customVal.noSpecialCharacters],
    })

    baseResources = new Array<WadlBaseResource>();
    resources = new Array<WadlResource>();
    methods: Array<string> = [];
    parameterTypes: Array<string> = [];
    requestParameterTable: Array<Record<string, any>> = [];
    requestRepresentationTable: Array<Record<string, any>> = [];

    constructor(
        private fb: FormBuilder,
        private prefixService: PrefixesService,
        private wadlService: WadlModelService,
    ) {}


    ngOnInit(): void {
        this.loadBaseResources();
        this.wadlService.getMethods().pipe(take(1), toSparqlVariableList()).subscribe(data => this.methods = data);
        this.wadlService.getParameterTypes().pipe(take(1), toSparqlVariableList()).subscribe(data => {
            this.parameterTypes = data;});
    }

    /**
     * Loads base resources together with their sub resources and paths
     */
    private loadBaseResources(): void {
        this.wadlService.getResources().pipe(take(1)).subscribe((data: SparqlResponse) => {
            this.baseResources = WadlBaseResource.fromSparqlResult(data);
        });
    }


    getExistingResourcesOfBase(): void {
        const selectedBasePath = this.requestForm.controls['resourceBasePath'].value;
        if(selectedBasePath) {
            const selectedBaseResource = this.baseResources.filter(elem => elem.baseResourcePath == selectedBasePath)[0];
            this.resources = selectedBaseResource.resources;
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
                parameterName: [table[i].parameterKey],
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
                bodyParameterName: [table[i].bodyParameterName],
                bodyDataType: [table[i].bodyDataType],
                bodyOptionValue: [table[i].bodyOptionValue],
            }));
        }
    }

    getExistingParameters(): void {
        console.log("get params");
        // this method should get the existing parameter table
        const basePath = this.requestForm.controls["resourceBasePath"].value;
        const resourcePath = this.requestForm.controls['resourcePath'].value;
        const method = this.requestForm.controls['method'].value;
        const parameterType = this.requestForm.controls['parameterType'].value;
        this.requestForm.controls['parameterName'].reset();
        this.requestForm.controls['dataType'].reset();
        this.requestForm.controls['optionValue'].reset();
        if (parameterType == "none") {
            // this.setRequestFormParameter([]);
        } else if (resourcePath && method && parameterType) {
            const resource = this.getResource(basePath, resourcePath);
            const methodTypeIri = this.prefixService.parseToIRI(method);
            const parameterTypeIri = this.prefixService.parseToIRI(parameterType);
            this.wadlService.getRequestParameters(resource.baseResourceIri, resource.resourceIri, methodTypeIri, parameterTypeIri)
                .pipe(take(1), toSparqlTable())
                .subscribe((data: any) => {
                    console.log("got data");
                    console.log(data);
                    this.requestParameterTable = data;
                    // this.setRequestFormParameter(this.requestParameterTable);
                });
        }
    }

    // TODO: THis one and the method "getExistingParameters" should be called on value changes and not on click
    getExistingRequestRepresentation() {
        // this method should get the existing parameter table
        const basePath = this.requestForm.controls['resourceBasePath'].value;
        const resourcePath = this.requestForm.controls['resourcePath'].value;
        const methodTypeIri = this.prefixService.parseToIRI(this.requestForm.controls['method'].value);
        if(basePath && resourcePath && methodTypeIri) {
            const resourceIri = this.getResource(basePath, resourcePath).resourceIri;
            this.wadlService.getRequestRepresentation(resourceIri, methodTypeIri).pipe(take(1), toSparqlTable()).subscribe((data: any) => {
                this.requestRepresentationTable = data;
                // this.setRequestFormRepresentation(this.requestRepresentationTable);
            });
        }
    }

    getResource(basePath: string, resourcePath: string): WadlResource {
        const baseResource = this.baseResources.find(b => b.baseResourcePath == basePath);
        const resource = baseResource.resources.find(r => r.resourcePath == resourcePath);
        return resource;
    }

    addMethod(): void {
        if(this.requestForm.valid) {
            const baseresourcePath = this.prefixService.parseToIRI(this.requestForm.controls['resourceBasePath'].value);
            const resourcePath = this.prefixService.parseToIRI(this.requestForm.controls['resourcePath'].value);
            const resource = this.getResource(baseresourcePath, resourcePath);
            const resourceIri = resource.resourceIri;
            const methodTypeName = this.prefixService.parseToName(this.requestForm.controls['method'].value);
            const methodTypeIri = this.prefixService.parseToIRI(this.requestForm.controls['method'].value);
            const methodIri = resourceIri + "_" + methodTypeName;

            console.log("resource IRI");
            console.log(resourceIri);

            console.log("methodIri");
            console.log(methodIri);

            const paramName = this.requestForm.controls['parameterName'].value;
            const paramType = this.requestForm.controls['parameterType'].value;
            const dataType = this.requestForm.controls['dataType'].value;

            const request = new WadlRequest(methodIri);
            request.addParameter(paramName, paramType, WadlTypesOfDataTypes.NonOntological, dataType);

            const method = new WadlMethod(resourceIri, methodTypeIri, request);
            this.wadlService.addMethod(method).pipe(take(1)).subscribe();
        }
    }

    // TODO: Add separate methods for delete and build
    createRequestParameter(action:string): void {
        if(this.requestForm.valid) {
            const serviceIRI = this.prefixService.parseToIRI(this.requestForm.controls['resourcePath'].value);
            const methodTypeIRI = this.prefixService.parseToIRI(this.requestForm.controls['method'].value);
            const methodIRI = serviceIRI + "_" + this.prefixService.parseToName(this.requestForm.controls['method'].value);
            const requestIRI = methodIRI + "_Req";
            let parameterIri = "";
            if (this.requestForm.controls['parameterType'].value != "none" && this.requestForm.controls['parameterName'].value != "") {
                const parameterName = this.requestForm.controls['parameterName'].value;
                parameterIri = requestIRI + "_" + parameterName;
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

            const request = null;

            this.wadlService.addMethod(request).pipe(take(1)).subscribe((data: any) => {
                // this.loadDynamicDropdowns();
                // this.loadDynamicTables();
                this.getExistingParameters();
            });
        }
    }

    createRequestRepresentationParameter(action: string): void {
        if(this.requestForm.valid) {
            const serviceIRI = this.prefixService.parseToIRI(this.requestForm.controls['resourcePath'].value);
            const methodTypeIRI = this.prefixService.parseToIRI(this.requestForm.controls['method'].value);
            const methodIRI = serviceIRI + "_" + this.prefixService.parseToName(this.requestForm.controls['method'].value);
            const requestIRI = methodIRI + "_Req";
            const bodyRepresentationMediaType = this.requestForm.controls['bodyMediaType'].value;
            const bodyRepresentationIRI = requestIRI + "_BodyRep_" + bodyRepresentationMediaType;
            const bodyRepresentationParameterName = this.requestForm.controls['bodyParameterName'].value;

            if (this.requestForm.controls['ontologicalBodyDataType'].value == "ontologicalDataTypeTBox") {
                const bodyRepresentationParameterDataTypeOntologicalTBox = this.prefixService.parseToIRI(this.requestForm.controls['bodyDataType'].value);
            } else if (this.requestForm.controls['ontologicalBodyDataType'].value == "ontologicalDataTypeABox") {
                const bodyRepresentationParameterDataTypeOntologicalABox = this.prefixService.parseToIRI(this.requestForm.controls['bodyDataType'].value);
            } else {
                const bodyRepresentationParameterDataType = this.requestForm.controls['bodyDataType'].value;
            }

            const bodyRepresentationParameterDataType = this.requestForm.controls['bodyDataType'].value;
            const bodyRepresentationParameterIRI = bodyRepresentationIRI + "_" + bodyRepresentationParameterName;
            const bodyRepresentationParameterOptionValue = this.requestForm.controls['bodyOptionValue'].value;
            if (bodyRepresentationParameterOptionValue != "" && bodyRepresentationParameterOptionValue) {
                const bodyRepresentationParameterOptionIRI = bodyRepresentationParameterIRI + "_Option";
            }
            // TODO: Pass proper data object
            const request = null;
            this.wadlService.addMethod(request).pipe(take(1)).subscribe((data: any) => {
                this.getExistingRequestRepresentation();
            });
        }
    }



    deleteParameter(context: string, parameterName) {
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
