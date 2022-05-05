import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormArray } from '@angular/forms';
import { Validators } from '@angular/forms';

import { WadlModelService, WADLVARIABLES } from '../rdf-models/wadlModel.service';
import { Iso22400_2ModelService } from '../rdf-models/iso22400_2Model.service';
import { Vdi2206ModelService } from '../rdf-models/vdi2206Model.service';
import { Vdi3682ModelService } from '../rdf-models/vdi3682Model.service';

import { PrefixesService } from '../../shared/services/prefixes.service';
import { cValFns } from '../utils/validators';

import { DataLoaderService } from '../../shared/services/dataLoader.service';
import { MessagesService } from '../../shared/services/messages.service';
import { Tables } from '../utils/tables';
import { take } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { toSparqlTable, toSparqlVariableList } from '../utils/rxjs-custom-operators';
import { TboxService } from '../rdf-models/tbox.service';


@Component({
    selector: 'app-wadl',
    templateUrl: './wadl.component.html',
    styleUrls: ['../../app.component.scss', './wadl.component.scss']
})
export class WadlComponent implements OnInit {

    // util variables
    keys = Object.keys;
    tableUtil = new Tables();
    _OntologicalDataType: string;
    customVal = new cValFns();

    // checkboxes and radios
    requestBodyRepresentationCheck;
    responseBodyRepresentationCheck;
    ontologicalDataTypeRadio;
    requestBodyRepresentationRadio;

    // model data
    modelVariables = new WADLVARIABLES();

    // stats
    NoOfResourceBasePaths: number;
    NoOfServices: number;

    // forms
    serviceForm = this.fb.group({
        resourceBasePath: [undefined, Validators.required],
        servicePath: [undefined, [Validators.required, this.customVal.noProtocol, Validators.pattern('([-a-zA-Z0-9()@:%_\+.~#?&//=]){1,}')]]
    })

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

    responseForm = this.fb.group({
        resourceBasePath: [undefined, Validators.required],
        servicePath: [undefined, Validators.required],
        method: [undefined, Validators.required],
        responseCode: [undefined, Validators.required],
        responseFormRepresentationArray: this.fb.array([
            this.fb.control('')
        ]),
        bodyMediaType: [undefined, this.customVal.noSpecialCharacters],
        bodyParameterKey: [undefined, this.customVal.noSpecialCharacters],
        bodyDataType: [undefined, this.customVal.noSpecialCharacters],
        ontologicalBodyDataType: [undefined],
        bodyOptionValue: [undefined, this.customVal.noSpecialCharacters],
    })

    ontologicalDataType = this.fb.group({
        TBox: [undefined, Validators.required],
        type: [undefined, Validators.required],
        individual: [undefined]
    })

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
    get responseFormRepresentationArray() {
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



    // graph db data -> dynamic dropdowns
    resourceBasePaths: Array<string> = [];
    servicePaths: Array<string> = [];
    classes: Array<string> = [];
    individuals: Array<string> = [];

    // graph db data -> static dropdowns
    methods: Array<string> = [];
    parameterTypes: Array<string> = [];
    responseCodes: Array<string> = [];
    tboxes: Array<string> = [];

    // graph db data -> dynamic tables
    baseResourcesTable: Array<Record<string, any>> = [];
    servicesTable: Array<Record<string, any>> = [];
    requestParameterTable: Array<Record<string, any>> = [];
    requestRepresentationTable: Array<Record<string, any>> = [];
    responseRepresentationTable: Array<Record<string, any>> = [];


    constructor(
        private fb: FormBuilder,
        private nameService: PrefixesService,
        private tBoxService: TboxService,
        private wadlService: WadlModelService,
        private loadingScreenService: DataLoaderService,
        private messageService: MessagesService
    ) {
    }


    ngOnInit() {
        this.requestFormParameterArray.removeAt(0);
        this.getDropdowns();
    }

    createTripel(action: string, context: string, form) {
        if (form.valid) {
            switch (context) {
            case "service": {
                this.modelVariables.baseResourceIRI = this.nameService.addOrParseNamespace(form.controls['resourceBasePath'].value);
                this.modelVariables.servicePath = "/" + form.controls['servicePath'].value;
                this.modelVariables.serviceIRI = this.modelVariables.baseResourceIRI + this.modelVariables.servicePath;
                this.wadlService.modifyService(this.modelVariables, action).pipe(take(1)).subscribe((data: any) => {
                    this.loadDynamicDropdowns();
                    this.loadDynamicTables();
                    this.modelVariables = new WADLVARIABLES();
                });
                break;
            }
            case "requestParameter": {
                this.modelVariables.serviceIRI = this.nameService.parseToIRI(form.controls['servicePath'].value);
                this.modelVariables.methodTypeIRI = this.nameService.parseToIRI(form.controls['method'].value);
                this.modelVariables.methodIRI = this.modelVariables.serviceIRI + "_" + this.nameService.parseToName(form.controls['method'].value);
                this.modelVariables.requestIRI = this.modelVariables.methodIRI + "_Req";
                if (form.controls['parameterType'].value != "none" && form.controls['parameterKey'].value != "") {
                    this.modelVariables.parameterKey = form.controls['parameterKey'].value;
                    this.modelVariables.parameterIRI = this.modelVariables.requestIRI + "_" + this.modelVariables.parameterKey;
                    this.modelVariables.parameterTypeIRI = this.nameService.parseToIRI(form.controls['parameterType'].value);
                }
                if (form.controls['ontologicalDataType'].value == "ontologicalDataTypeTBox") {
                    this.modelVariables.parameterDataTypeTBox = this.nameService.parseToIRI(form.controls['dataType'].value);
                } else if (form.controls['ontologicalDataType'].value == "ontologicalDataTypeABox") {
                    this.modelVariables.parameterDataTypeABox = this.nameService.parseToIRI(form.controls['dataType'].value);
                } else {
                    this.modelVariables.parameterDataType = form.controls['dataType'].value;
                }
                this.modelVariables.optionValue = form.controls['optionValue'].value;
                if (this.modelVariables.optionValue != "" && this.modelVariables.optionValue) { this.modelVariables.optionIRI = this.modelVariables.parameterIRI + "_Option"; }
                console.log(this.modelVariables);
                this.wadlService.modifyRequest(this.modelVariables, action).pipe(take(1)).subscribe((data: any) => {
                    this.loadingScreenService.stopLoading();
                    this.loadDynamicDropdowns();
                    this.loadDynamicTables();
                    this.getExistingParameter(this.requestForm.controls['servicePath'].value, this.requestForm.controls['method'].value, this.requestForm.controls['parameterType'].value);
                    this.modelVariables = new WADLVARIABLES();
                });
                break;
            }
            case "requestRepresentationParameter": {
                this.modelVariables.serviceIRI = this.nameService.parseToIRI(form.controls['servicePath'].value);
                this.modelVariables.methodTypeIRI = this.nameService.parseToIRI(form.controls['method'].value);
                this.modelVariables.methodIRI = this.modelVariables.serviceIRI + "_" + this.nameService.parseToName(form.controls['method'].value);
                this.modelVariables.requestIRI = this.modelVariables.methodIRI + "_Req";
                this.modelVariables.bodyRepresentationMediaType = form.controls['bodyMediaType'].value;
                this.modelVariables.bodyRepresentationIRI = this.modelVariables.requestIRI + "_BodyRep_" + this.modelVariables.bodyRepresentationMediaType;
                this.modelVariables.bodyRepresentationParameterKey = form.controls['bodyParameterKey'].value;

                if (form.controls['ontologicalBodyDataType'].value == "ontologicalDataTypeTBox") {
                    this.modelVariables.bodyRepresentationParameterDataTypeOntologicalTBox = this.nameService.parseToIRI(form.controls['bodyDataType'].value);
                } else if (form.controls['ontologicalBodyDataType'].value == "ontologicalDataTypeABox") {
                    this.modelVariables.bodyRepresentationParameterDataTypeOntologicalABox = this.nameService.parseToIRI(form.controls['bodyDataType'].value);
                } else {
                    this.modelVariables.bodyRepresentationParameterDataType = form.controls['bodyDataType'].value;
                }

                this.modelVariables.bodyRepresentationParameterDataType = form.controls['bodyDataType'].value;
                this.modelVariables.bodyRepresentationParameterIRI = this.modelVariables.bodyRepresentationIRI + "_" + this.modelVariables.bodyRepresentationParameterKey;
                this.modelVariables.bodyRepresentationParameterOptionValue = form.controls['bodyOptionValue'].value;
                if (this.modelVariables.bodyRepresentationParameterOptionValue != "" && this.modelVariables.bodyRepresentationParameterOptionValue) { this.modelVariables.bodyRepresentationParameterOptionIRI = this.modelVariables.bodyRepresentationParameterIRI + "_Option"; }
                this.wadlService.modifyRequest(this.modelVariables, action).pipe(take(1)).subscribe((data: any) => {
                    this.loadingScreenService.stopLoading();
                    this.getExistingRepresentation(this.requestForm.controls['servicePath'].value, this.requestForm.controls['method'].value, "request");
                    this.modelVariables = new WADLVARIABLES();
                });
                break;
            }
            case "response": {
                this.modelVariables.serviceIRI = this.nameService.parseToIRI(form.controls['servicePath'].value);
                this.modelVariables.methodTypeIRI = this.nameService.parseToIRI(form.controls['method'].value);
                this.modelVariables.methodIRI = this.modelVariables.serviceIRI + "_" + this.nameService.parseToName(form.controls['method'].value);
                this.modelVariables.responseTypeIRI = this.nameService.parseToIRI(form.controls['responseCode'].value);
                this.modelVariables.responseIRI = this.modelVariables.methodIRI + "_Res" + this.nameService.parseToName(form.controls['responseCode'].value);
                this.wadlService.modifyResponse(this.modelVariables, action).pipe(take(1)).subscribe((data: any) => {
                    this.loadingScreenService.stopLoading();
                    this.modelVariables = new WADLVARIABLES();
                });
                break;
            }
            case "responseRepresentationParameter": {
                this.modelVariables.serviceIRI = this.nameService.parseToIRI(form.controls['servicePath'].value);
                this.modelVariables.methodTypeIRI = this.nameService.parseToIRI(form.controls['method'].value);
                this.modelVariables.methodIRI = this.modelVariables.serviceIRI + "_" + this.nameService.parseToName(form.controls['method'].value);
                this.modelVariables.responseIRI = this.modelVariables.methodIRI + "_Res" + this.nameService.parseToName(form.controls['responseCode'].value);
                this.modelVariables.responseTypeIRI = this.nameService.parseToIRI(form.controls['responseCode'].value);
                this.modelVariables.bodyRepresentationMediaType = form.controls['bodyMediaType'].value;
                this.modelVariables.bodyRepresentationIRI = this.modelVariables.responseIRI + "_BodyRep_" + this.modelVariables.bodyRepresentationMediaType;
                this.modelVariables.bodyRepresentationParameterKey = form.controls['bodyParameterKey'].value;

                if (form.controls['ontologicalBodyDataType'].value == "ontologicalDataTypeTBox") {
                    this.modelVariables.bodyRepresentationParameterDataTypeOntologicalTBox = this.nameService.parseToIRI(form.controls['bodyDataType'].value);
                } else if (form.controls['ontologicalBodyDataType'].value == "ontologicalDataTypeABox") {
                    this.modelVariables.bodyRepresentationParameterDataTypeOntologicalABox = this.nameService.parseToIRI(form.controls['bodyDataType'].value);
                } else {
                    this.modelVariables.bodyRepresentationParameterDataType = form.controls['bodyDataType'].value;
                }

                this.modelVariables.bodyRepresentationParameterDataType = form.controls['bodyDataType'].value;
                this.modelVariables.bodyRepresentationParameterIRI = this.modelVariables.bodyRepresentationIRI + "_" + this.modelVariables.bodyRepresentationParameterKey;
                this.modelVariables.bodyRepresentationParameterOptionValue = form.controls['bodyOptionValue'].value;
                if (this.modelVariables.bodyRepresentationParameterOptionValue != "" && this.modelVariables.bodyRepresentationParameterOptionValue) { this.modelVariables.bodyRepresentationParameterOptionIRI = this.modelVariables.bodyRepresentationParameterIRI + "_Option"; }
                this.wadlService.modifyResponse(this.modelVariables, action).pipe(take(1)).subscribe((data: any) => {
                    this.getExistingRepresentation(this.responseForm.controls['servicePath'].value, this.responseForm.controls['method'].value, "response");
                    this.modelVariables = new WADLVARIABLES();
                });
                break;
            }
            }
        } else if (form.invalid) {
            this.messageService.addMessage('error', 'Ups!', 'It seems like you are missing some data here...');
        }
    }


    getExistingServicesByBase(selectedResourceBasePath) {
        // this method should get the existing services per base path as list
        if (selectedResourceBasePath) {
            selectedResourceBasePath = this.nameService.parseToIRI(selectedResourceBasePath);
            this.wadlService.getServicesByBase(selectedResourceBasePath).pipe(take(1)).subscribe((data: any) => {
                this.servicePaths = data;
            });
        }

    }

    getExistingParameter(servicePath, method, parameterType) {
        // this method should get the existing parameter table
        this.requestForm.controls['parameterKey'].setValue('');
        this.requestForm.controls['dataType'].setValue('');
        this.requestForm.controls['optionValue'].setValue('');
        if (parameterType == "none") {
            this.setRequestFormParameter([]);
        } else if (servicePath && method && parameterType) {
            const serviceIri = this.nameService.parseToIRI(servicePath);
            const methodTypeIri = this.nameService.parseToIRI(method);
            const parameterTypeIri = this.nameService.parseToIRI(parameterType);
            this.wadlService.getRequestParameters(serviceIri, methodTypeIri, parameterTypeIri).pipe(take(1), toSparqlTable())
                .subscribe((data: any) => {
                    this.loadingScreenService.stopLoading();
                    this.requestParameterTable = data;
                    this.setRequestFormParameter(this.requestParameterTable);
                });
        }

    }

    getExistingRepresentation(servicePath, method, context) {
        // this method should get the existing parameter table
        if (servicePath && method && (context == "request")) {
            const serviceIRI = this.nameService.parseToIRI(servicePath);
            const methodIRI = this.nameService.parseToIRI(method);
            this.wadlService.loadTABLE_OF_REQUEST_REPRESENTATION(serviceIRI, methodIRI).pipe(take(1)).subscribe((data: any) => {
                this.loadingScreenService.stopLoading();
                this.requestRepresentationTable = data;
                this.setRequestFormRepresentation(this.requestRepresentationTable);
            });
        } else if (servicePath && method && (context == "response")) {
            const serviceIRI = this.nameService.parseToIRI(servicePath);
            const methodIRI = this.nameService.parseToIRI(method);
            this.wadlService.loadTABLE_OF_RESPONSE_REPRESENTATION(serviceIRI, methodIRI).pipe(take(1)).subscribe((data: any) => {
                this.loadingScreenService.stopLoading();
                this.responseRepresentationTable = data;
                this.setResponseFormRepresentation(this.responseRepresentationTable);
            });
        }
    }

    getExistingClasses(owlEntity) {
        if (owlEntity) {
            this.wadlService.loadLIST_ONTOLOGICAL_TYPES_BY_NAMESPACE(owlEntity).pipe(take(1)).subscribe((data: any) => {
                this.loadingScreenService.stopLoading();
                this.classes = data;
            });
        }
    }

    getExistingIndividuals(owlClass: string) {
        owlClass = this.nameService.parseToIRI(owlClass);
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
            if (IRI) {
                this.requestForm.controls['dataType'].setValue(IRI);
                this.requestForm.controls['ontologicalDataType'].setValue(type);
            } else {
                this.requestForm.controls['dataType'].setValue(IRI);
                this.requestForm.controls['ontologicalDataType'].setValue(IRI);
            }
            break;
        }
        case "requestBodyParameter": {
            if (IRI) {
                this.requestForm.controls['bodyDataType'].setValue(IRI);
                this.requestForm.controls['ontologicalBodyDataType'].setValue(type);
            } else {
                this.requestForm.controls['bodyDataType'].setValue(IRI);
                this.requestForm.controls['ontologicalBodyDataType'].setValue(IRI);
            }
            break;
        }
        case "responseBodyParameter": {
            if (IRI) {
                this.responseForm.controls['bodyDataType'].setValue(IRI);
                this.responseForm.controls['ontologicalBodyDataType'].setValue(type);
            } else {
                this.responseForm.controls['bodyDataType'].setValue(IRI);
                this.responseForm.controls['ontologicalBodyDataType'].setValue(IRI);
            }
            break;
        }

        }
    }



    tableClick(context: string, event) {
        switch (context) {
        case "SERVICE": {
            this.serviceForm.controls['resourceBasePath'].setValue(event.baseResource);
            this.serviceForm.controls['servicePath'].setValue(event.servicePath.slice(1));
            break;
        }
        }
    }

    deleteParameter(context: string, parameterKey) {
        switch (context) {
        case "key": {
            this.modelVariables.parameterKey = parameterKey;
            this.wadlService.deleteParameter(this.modelVariables).pipe(take(1)).subscribe((data: any) => {
                this.loadingScreenService.stopLoading();
                this.modelVariables = new WADLVARIABLES();
                this.getExistingParameter(this.requestForm.controls['servicePath'].value, this.requestForm.controls['method'].value, this.requestForm.controls['parameterType'].value);
                this.getExistingRepresentation(this.requestForm.controls['servicePath'].value, this.requestForm.controls['method'].value, "request");
                this.getExistingRepresentation(this.responseForm.controls['servicePath'].value, this.responseForm.controls['method'].value, "response");
            });
            break;
        }
        case "option": {
            this.modelVariables.parameterKey = parameterKey;
            this.wadlService.deleteOption(this.modelVariables).pipe(take(1)).subscribe((data: any) => {
                this.loadingScreenService.stopLoading();
                this.modelVariables = new WADLVARIABLES();
                this.getExistingParameter(this.requestForm.controls['servicePath'].value, this.requestForm.controls['method'].value, this.requestForm.controls['parameterType'].value);
                this.getExistingRepresentation(this.requestForm.controls['servicePath'].value, this.requestForm.controls['method'].value, "request");
                this.getExistingRepresentation(this.responseForm.controls['servicePath'].value, this.responseForm.controls['method'].value, "response");
            });
            break;
        }
        }
    }

    loadDynamicDropdowns() {
        this.wadlService.getBaseResources().pipe(take(1), toSparqlVariableList("baseResource")).subscribe((data: any) => {
            this.resourceBasePaths = data;
            this.NoOfResourceBasePaths = this.resourceBasePaths.length;
        });
        this.wadlService.getServices().pipe(take(1), toSparqlVariableList("service")).subscribe((data: any) => {
            this.NoOfResourceBasePaths = this.resourceBasePaths.length;
        });
    }

    loadDynamicTables() {
        this.wadlService.getBaseResources().pipe(take(1), toSparqlTable()).subscribe((data: any) => {
            this.baseResourcesTable = data;
        });
        this.wadlService.getServices().pipe(take(1), toSparqlTable()).subscribe((data: any) => {
            this.servicesTable = data;
        });
    }

    getDropdowns() {
        this.wadlService.getBaseResources().pipe(take(1), toSparqlVariableList("baseResource")).subscribe(data => {
            this.resourceBasePaths = data;
            this.NoOfResourceBasePaths = this.resourceBasePaths.length;
        });
        this.wadlService.getServices().pipe(take(1), toSparqlVariableList("service")).subscribe(data => {
            this.servicePaths = data;
            this.NoOfServices = this.servicePaths.length;
        });
        this.wadlService.getMethods().pipe(take(1), toSparqlVariableList())
            .subscribe(data => this.methods = data);
        this.wadlService.getParameterTypes().pipe(take(1), toSparqlVariableList("parameterType"))
            .subscribe(data => this.parameterTypes = data);
        this.wadlService.getResponseCodes().pipe(take(1), toSparqlVariableList())
            .subscribe(data => this.responseCodes = data);
    }
}
