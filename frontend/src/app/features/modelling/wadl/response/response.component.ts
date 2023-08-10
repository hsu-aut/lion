import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { take } from "rxjs";
import { PrefixesService } from "@shared-services/prefixes.service";
import { WadlModelService } from "../../rdf-models/wadlModel.service";
import { WadlCreateResponseDto, WadlResponse } from "@shared/models/odps/wadl/WadlResponse";
import { cValFns } from "../../utils/validators";
import { WadlBaseResource } from "@shared/models/odps/wadl/BaseResource";
import { WadlResource } from "@shared/models/odps/wadl/Resource";
import { toSparqlVariableList } from "../../utils/rxjs-custom-operators";
import { SparqlResponse } from "@shared/models/sparql/SparqlResponse";
import { MessagesService } from "@shared-services/messages.service";
import { plainToClass } from "class-transformer";

@Component({
    selector: 'wadl-response',
    templateUrl: './response.component.html',
    // styleUrls: ['../wadl.component.scss']
})
export class ResponseComponent {

    baseResources = new Array<WadlBaseResource>();
    resources = new Array<WadlResource>();
    methods: Array<string> = [];
    statusCodes: Array<string>;
    existingResponse: WadlResponse;

    responseForm = this.fb.group({
        resourceBasePath: ["", Validators.required],
        resource: [this.resources[0], Validators.required],
        methodType: ["", Validators.required],
        statusCode: ["", Validators.required]
    })

    constructor(
        private fb: FormBuilder,
        private wadlService: WadlModelService,
        private messageService: MessagesService
    ) {}

    ngOnInit(): void {
        this.loadBaseResources();
        this.wadlService.getResponseCodes().pipe(toSparqlVariableList()).subscribe(responseCodes => this.statusCodes = responseCodes);
        this.wadlService.getMethods().pipe(take(1), toSparqlVariableList()).subscribe(data => this.methods = data);
        this.responseForm.valueChanges.subscribe(data => {
            if (this.responseForm.valid) {
                this.updateExistingResponse();
            }
        });
    }

    private loadBaseResources(): void {
        this.wadlService.getBaseResources().subscribe(resources => this.baseResources = resources);
    }

    /**
     * On every change to the form, updates the existing response
     */
    updateExistingResponse(): void {
        const {resource, methodType, statusCode: responseCode} = this.responseForm.value;
        const wadlCreateResponse = new WadlCreateResponseDto(resource.resourceIri, methodType, responseCode);
        this.wadlService.getResponse(wadlCreateResponse).subscribe(responseDto => {
            this.existingResponse = WadlResponse.fromDto(responseDto);
        });
    }

    getExistingResourcesOfBase(): void {
        const selectedBasePath = this.responseForm.get('resourceBasePath').value;
        if(selectedBasePath) {
            const selectedBaseResource = this.baseResources.filter(elem => elem.baseResourcePath == selectedBasePath)[0];
            this.resources = selectedBaseResource.resources;
        }
    }

    getSparqlInsert(): void {

    }

    deleteResponse(): void {

    }

    /**
     * Adds a plain response for the selected form fields in case there is none. Note that this step is required before parameters and representations can be added
     */
    addResponse(): void {
        if(!this.responseCanBeCreated) {
            this.messageService.warn('False request info','Form is invalid or this request already exists');
        } else {
            const {resource, methodType, statusCode: responseCode} = this.responseForm.value;
            const response = new WadlCreateResponseDto(resource.resourceIri, methodType, responseCode);
            this.wadlService.addResponse(response).subscribe(data => {
                console.log(data);
                this.existingResponse = plainToClass(WadlResponse, data);
            });
        }
    }

    /**
     * Identifies whether or not a response can and must be created. If the form is invalid, no response can be created. If there is an existing form, none must be created.
     */
    get responseCanBeCreated(): boolean {
        return (this.responseForm.valid && this.existingResponse == undefined);
    }

}
