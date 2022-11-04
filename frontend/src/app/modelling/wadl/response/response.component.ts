import { Component } from "@angular/core";
import { FormArray, FormBuilder, Validators } from "@angular/forms";
import { take } from "rxjs";
import { PrefixesService } from "../../../shared/services/prefixes.service";
import { WadlModelService } from "../../rdf-models/wadlModel.service";
import { WadlMethod } from "@shared/models/odps/wadl/WadlMethod";
import { WadlResponse } from "@shared/models/odps/wadl/WadlResponse";
import { cValFns } from "../../utils/validators";
import { WadlBaseResource } from "@shared/models/odps/wadl/BaseResource";
import { WadlResource } from "@shared/models/odps/wadl/Resource";
import { toSparqlVariableList } from "../../utils/rxjs-custom-operators";
import { SparqlResponse } from "@shared/models/sparql/SparqlResponse";

@Component({
    selector: 'wadl-response',
    templateUrl: './response.component.html',
    // styleUrls: ['../wadl.component.scss']
})
export class ResponseComponent {

    // Custom validator
    customVal = new cValFns();

    baseResources = new Array<WadlBaseResource>();
    resources = new Array<WadlResource>();
    methods: Array<string> = [];
    responseCodes: Array<string>;
    existingResponse: WadlResponse;

    responseForm = this.fb.group({
        resourceBasePath: ["", Validators.required],
        resource: [this.resources[0], Validators.required],
        methodType: ["", Validators.required],
        responseCode: ["", Validators.required]
    })

    responseBodyRepresentationCheck;
    responseRepresentationTable: Array<Record<string, any>> = [];

    constructor(
        private fb: FormBuilder,
        private prefixService: PrefixesService,
        private wadlService: WadlModelService,
    ) {}

    ngOnInit(): void {
        this.loadBaseResources();
        this.wadlService.getMethods().pipe(take(1), toSparqlVariableList()).subscribe(data => this.methods = data);
        this.responseForm.valueChanges.subscribe(data => {
            if (this.responseForm.valid) {
                this.updateExistingResponse();
            }
        });
    }

    private loadBaseResources(): void {
        this.wadlService.getResources().pipe(take(1)).subscribe((data: SparqlResponse) => {
            this.baseResources = WadlBaseResource.fromSparqlResult(data);
        });
    }

    updateExistingResponse() {
        const {resource, methodType, } = this.responseForm.value;
        this.wadlService.getRequest(resource.resourceIri, methodType).subscribe(data => {
            console.log(data);

            // TODO: Currently, a whole resource is returned. Make sure to only return request of it
            // this.existingRequest = data;
        });
    }

    getExistingResourcesOfBase(): void {
        const selectedBasePath = this.responseForm.controls['resourceBasePath'].value;
        if(selectedBasePath) {
            const selectedBaseResource = this.baseResources.filter(elem => elem.baseResourcePath == selectedBasePath)[0];
            this.resources = selectedBaseResource.resources;
        }
    }

    responseCanBeCreated(): boolean {
        return (this.responseForm.valid && this.existingResponse == undefined);
    }

    getSparqlInsert(): void {

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
