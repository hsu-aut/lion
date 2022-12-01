import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { take } from "rxjs";
import { WadlBaseResource } from "@shared/models/odps/wadl/BaseResource";
import { WadlModelService } from "../../rdf-models/wadlModel.service";
import { toSparqlTable, toSparqlVariableList } from "../../utils/rxjs-custom-operators";
import { cValFns } from "../../utils/validators";
import { SparqlResponse } from "@shared/models/sparql/SparqlResponse";
import { WadlResource } from "@shared/models/odps/wadl/Resource";
import { WadlCreateRequestDto, WadlRequest } from "@shared/models/odps/wadl/WadlRequest";
import { MessagesService } from "../../../shared/services/messages.service";
import { plainToClass } from "class-transformer";

@Component({
    selector: 'wadl-request',
    templateUrl: './request.component.html',
    // styleUrls: ['../wadl.component.scss']
})
export class RequestComponent implements OnInit {

    requestBodyRepresentationCheck;

    // Custom validator
    customVal = new cValFns();

    baseResources = new Array<WadlBaseResource>();
    resources = new Array<WadlResource>();
    methods: Array<string> = [];
    existingRequest: WadlRequest;

    requestForm = this.fb.group({
        resourceBasePath: ["", Validators.required],
        resource: [this.resources[0], Validators.required],
        methodType: ["", Validators.required],
    })

    requestParameterTable: Array<Record<string, any>> = [];
    requestRepresentationTable: Array<Record<string, any>> = [];

    constructor(
        private fb: FormBuilder,
        private messageService: MessagesService,
        private wadlService: WadlModelService,
    ) {}


    ngOnInit(): void {
        this.loadBaseResources();
        this.wadlService.getMethods().pipe(take(1), toSparqlVariableList()).subscribe(data => this.methods = data);
        this.requestForm.valueChanges.subscribe(data => {
            if (this.requestForm.valid) {
                this.updateExistingRequest();
            }
        });
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

    updateExistingRequest() {
        const {resource, methodType} = this.requestForm.value;
        this.wadlService.getRequest(resource.resourceIri, methodType).subscribe(data => {
            console.log(data);

            // TODO: Currently, a whole resource is returned. Make sure to only return request of it
            this.existingRequest = data;
        });
    }


    addRequest(): void {
        if(!this.requestCanBeCreated) {
            this.messageService.addMessage("warn", "False request info", "Form is invalid or this request already exists");
        } else {
            const {resource, methodType} = this.requestForm.value;
            const request = new WadlCreateRequestDto(resource.resourceIri, methodType);
            this.wadlService.addRequest(request).subscribe(data => this.existingRequest = plainToClass(WadlRequest, data));
        }
    }

    get requestCanBeCreated(): boolean {
        return (this.requestForm.valid && this.existingRequest == undefined);
    }

    deleteRequest():void {
        if(this.requestForm.invalid || !this.existingRequest) {
            this.messageService.addMessage("warn", "False request info", "Form is invalid or this request doesn't exist");
        }
    }

    getSparqlInsert(){
        if(this.requestForm.invalid) {
            this.messageService.addMessage("warn", "False request info", "Form is invalid");
        }
    }

    getResource(basePath: string, resourcePath: string): WadlResource {
        const baseResource = this.baseResources.find(b => b.baseResourcePath == basePath);
        const resource = baseResource.resources.find(r => r.resourcePath == resourcePath);
        return resource;
    }


}
