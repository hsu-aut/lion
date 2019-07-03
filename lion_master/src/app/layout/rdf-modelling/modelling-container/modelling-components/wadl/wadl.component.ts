import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormArray } from '@angular/forms';
import { Validators } from '@angular/forms';

import { WadlModelService, WADLVARIABLES } from '../../../rdf-models/wadlModel.service';
import { Iso22400_2ModelService } from '../../../../rdf-modelling/rdf-models/iso22400_2Model.service';
import { Vdi2206ModelService } from '../../../../rdf-modelling/rdf-models/vdi2206Model.service';
import { Vdi3682ModelService } from '../../../../rdf-modelling/rdf-models/vdi3682Model.service';

import { SparqlQueriesService } from '../../../rdf-models/services/sparql-queries.service';
import { PrefixesService } from '../../../rdf-models/services/prefixes.service';
import { DownloadService } from '../../../rdf-models/services/download.service';
import { DataLoaderService } from '../../../../../shared/services/dataLoader.service';
import { Tables } from '../../../utils/tables';
import { take } from 'rxjs/operators';


@Component({
  selector: 'app-wadl',
  templateUrl: './wadl.component.html',
  styleUrls: ['./wadl.component.scss']
})
export class WadlComponent implements OnInit {

  // util variables
  keys = Object.keys;
  tableUtil = new Tables();
  _OntologicalDataType: string;


  // model data
  modelVariables = new WADLVARIABLES();

  // stats
  NoOfResourceBasePaths: number;
  NoOfServices: number;

  // forms
  baseResourceForm = this.fb.group({
    resourceBasePath: [undefined, Validators.required],
    serviceProvider: [undefined]
  })

  serviceForm = this.fb.group({
    resourceBasePath: [undefined],
    servicePath: [undefined]
  })

  requestForm = this.fb.group({
    resourceBasePath: [undefined],
    servicePath: [undefined],
    method: [undefined],
    parameterType: [undefined],
    requestFormParameterArray: this.fb.array([
      this.fb.control('')
    ]),
    parameterKey: [undefined],
    dataType: [undefined],
    ontologicalDataType: [undefined],
    optionValue: [undefined],
    requestFormRepresentationArray: this.fb.array([
      this.fb.control('')
    ]),
    bodyMediaType: [undefined],
    bodyParameterKey: [undefined],
    bodyDataType: [undefined],
    ontologicalBodyDataType: [undefined],
    bodyOptionValue: [undefined],
  })

  responseForm = this.fb.group({
    resourceBasePath: [undefined],
    servicePath: [undefined],
    method: [undefined],
    responseCode: [undefined],
    responseFormRepresentationArray: this.fb.array([
      this.fb.control('')
    ]),
    bodyMediaType: [undefined],
    bodyParameterKey: [undefined],
    bodyDataType: [undefined],
    ontologicalBodyDataType: [undefined],
    bodyOptionValue: [undefined],
  })

  ontologicalDataType = this.fb.group({
    TBox: [undefined],
    type: [undefined],
    individual: [undefined]
  })

  // form array utils
  get requestFormParameterArray() {
    return this.requestForm.get('requestFormParameterArray') as FormArray;
  }
  setRequestFormParameter(table) {
    while (this.requestFormParameterArray.length !== 0) {
      this.requestFormParameterArray.removeAt(0)
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
      this.requestFormRepresentationArray.removeAt(0)
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
      this.responseFormRepresentationArray.removeAt(0)
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
  baseResourcesTable: Array<Object> = [];
  servicesTable: Array<Object> = [];
  requestParameterTable: Array<Object> = [];
  requestRepresentationTable: Array<Object> = [];
  responseRepresentationTable: Array<Object> = [];

  // graph db data -> static tables
  allVDIInfo: Array<Object> = [];
  allIsoEntityInfo: Array<Object> = [];

  constructor(
    private fb: FormBuilder,
    private query: SparqlQueriesService,
    private dlService: DownloadService,
    private nameService: PrefixesService,
    private wadlService: WadlModelService,
    private vdi3682Service: Vdi3682ModelService,
    private vdi2206Service: Vdi2206ModelService,
    private isoService: Iso22400_2ModelService,
    private loadingScreenService: DataLoaderService) {
  }


  ngOnInit() {
    this.requestFormParameterArray.removeAt(0);
    this.getDropdowns();
    this.getTables();
  }

  createTripel(action: string, context: string, form) {
    switch (context) {
      case "baseResource": {
        this.modelVariables.baseResourcePath = "http://" + form.controls['resourceBasePath'].value;
        this.modelVariables.baseResourceIRI = this.nameService.addOrParseNamespace(form.controls['resourceBasePath'].value);
        this.modelVariables.serviceProviderIRI = this.nameService.addOrParseNamespace(form.controls['serviceProvider'].value);
        this.wadlService.modifyBaseResource(this.modelVariables, action).pipe(take(1)).subscribe((data: any) => {
          this.loadingScreenService.stopLoading();
          this.loadDynamicDropdowns();
          this.loadDynamicTables();
          this.modelVariables = new WADLVARIABLES();
        });

        break;
      }
      case "service": {
        this.modelVariables.baseResourceIRI = this.nameService.addOrParseNamespace(form.controls['resourceBasePath'].value);
        this.modelVariables.servicePath = "/" + form.controls['servicePath'].value;
        this.modelVariables.serviceIRI = this.modelVariables.baseResourceIRI + this.modelVariables.servicePath;
        this.wadlService.modifyService(this.modelVariables, action).pipe(take(1)).subscribe((data: any) => {
          this.loadingScreenService.stopLoading();
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
        this.modelVariables.parameterKey = form.controls['parameterKey'].value;
        this.modelVariables.parameterIRI = this.modelVariables.requestIRI + "_" + this.modelVariables.parameterKey;
        this.modelVariables.parameterTypeIRI = this.nameService.parseToIRI(form.controls['parameterType'].value);
        if (form.controls['ontologicalDataType'].value == "ontologicalDataTypeTBox") {
          this.modelVariables.parameterDataTypeTBox = this.nameService.parseToIRI(form.controls['dataType'].value);
        } else if (form.controls['ontologicalDataType'].value == "ontologicalDataTypeABox") {
          this.modelVariables.parameterDataTypeABox = this.nameService.parseToIRI(form.controls['dataType'].value);
        } else {
          this.modelVariables.parameterDataType = form.controls['dataType'].value;
        }
        this.modelVariables.optionValue = form.controls['optionValue'].value;
        if (this.modelVariables.optionValue != "" && this.modelVariables.optionValue) { this.modelVariables.optionIRI = this.modelVariables.parameterIRI + "_Option"; }
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
          this.loadingScreenService.stopLoading();
          this.getExistingRepresentation(this.responseForm.controls['servicePath'].value, this.responseForm.controls['method'].value, "response");
          this.modelVariables = new WADLVARIABLES();
        });
        break;
      }
    }
  }


  getExistingServicesByBase(selectedResourceBasePath) {
    // this method should get the existing services per base path as list
    if (selectedResourceBasePath) {
      selectedResourceBasePath = this.nameService.parseToIRI(selectedResourceBasePath);
      this.wadlService.loadLIST_OF_SERVICES_BY_BASE(selectedResourceBasePath).pipe(take(1)).subscribe((data: any) => {
        this.loadingScreenService.stopLoading();
        this.servicePaths = data;
      });
    }

  }

  getExistingParameter(servicePath, method, parameterType) {
    // this method should get the existing parameter table
    if (servicePath && method && parameterType) {

      let serviceIRI = this.nameService.parseToIRI(servicePath);
      let methodIRI = this.nameService.parseToIRI(method);
      let parameterTypeIRI = this.nameService.parseToIRI(parameterType);
      this.wadlService.loadTABLE_OF_REQUEST_PARAMETERS(serviceIRI, methodIRI, parameterTypeIRI).pipe(take(1)).subscribe((data: any) => {
        this.loadingScreenService.stopLoading();
        this.requestParameterTable = data;
        this.setRequestFormParameter(this.requestParameterTable)
      });
    }

  }

  getExistingRepresentation(servicePath, method, context) {
    // this method should get the existing parameter table
    if (servicePath && method && (context == "request")) {
      let serviceIRI = this.nameService.parseToIRI(servicePath);
      let methodIRI = this.nameService.parseToIRI(method);
      this.wadlService.loadTABLE_OF_REQUEST_REPRESENTATION(serviceIRI, methodIRI).pipe(take(1)).subscribe((data: any) => {
        this.loadingScreenService.stopLoading();
        this.requestRepresentationTable = data;
        this.setRequestFormRepresentation(this.requestRepresentationTable)
      });
    } else if (servicePath && method && (context == "response")) {
      let serviceIRI = this.nameService.parseToIRI(servicePath);
      let methodIRI = this.nameService.parseToIRI(method);
      this.wadlService.loadTABLE_OF_RESPONSE_REPRESENTATION(serviceIRI, methodIRI).pipe(take(1)).subscribe((data: any) => {
        this.loadingScreenService.stopLoading();
        this.responseRepresentationTable = data;
        this.setResponseFormRepresentation(this.responseRepresentationTable)
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

  getExistingIndividuals(owlClass) {
    if (owlClass) {
      owlClass = this.nameService.parseToIRI(owlClass);
      this.wadlService.loadLIST_INDIVIDUALS_BY_CLASS(owlClass).pipe(take(1)).subscribe((data: any) => {
        this.loadingScreenService.stopLoading();
        this.individuals = data;
      });
    }
  }

  setOntologicalDataType(context: string) {
    this._OntologicalDataType = context;
  }
  setDataType(IRI, type) {
    switch (this._OntologicalDataType) {
      case "requestParameter": {
        if (IRI) {
          this.requestForm.controls['dataType'].setValue(IRI)
          this.requestForm.controls['ontologicalDataType'].setValue(type)
        } else {
          this.requestForm.controls['dataType'].setValue(IRI)
          this.requestForm.controls['ontologicalDataType'].setValue(IRI)
        }
        break;
      }
      case "requestBodyParameter": {
        if (IRI) {
          this.requestForm.controls['bodyDataType'].setValue(IRI)
          this.requestForm.controls['ontologicalBodyDataType'].setValue(type)
        } else {
          this.requestForm.controls['bodyDataType'].setValue(IRI)
          this.requestForm.controls['ontologicalBodyDataType'].setValue(IRI)
        }
        break;
      }
      case "responseBodyParameter": {
        if (IRI) {
          this.responseForm.controls['bodyDataType'].setValue(IRI)
          this.responseForm.controls['ontologicalBodyDataType'].setValue(type)
        } else {
          this.responseForm.controls['bodyDataType'].setValue(IRI)
          this.responseForm.controls['ontologicalBodyDataType'].setValue(IRI)
        }
        break;
      }

    }
  }



  tableClick(context: string, event) {
    switch (context) {
      case "VDI": {
        this.baseResourceForm.controls['serviceProvider'].setValue(event)
        break;
      }
      case "ISO": {
        this.baseResourceForm.controls['serviceProvider'].setValue(event.Entity)
        break;
      }
      case "WADL": {
        // console.log(event.basePath.slice(7))
        this.baseResourceForm.controls['serviceProvider'].setValue(event.serviceProvider)
        this.baseResourceForm.controls['resourceBasePath'].setValue(event.basePath.slice(7))
        break;
      }
      case "SERVICE": {
        this.serviceForm.controls['resourceBasePath'].setValue(event.baseResource)
        this.serviceForm.controls['servicePath'].setValue(event.servicePath.slice(1))
        break;
      }
    }
  }

  deleteParameter(context: string, parameterKey) {
    switch (context) {
      case "key": {
        this.modelVariables.parameterKey = parameterKey
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
        this.modelVariables.parameterKey = parameterKey
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
    this.wadlService.loadLIST_BASE_RESOURCES().pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.wadlService.setLIST_BASE_RESOURCES(data);
      this.resourceBasePaths = data;
      this.NoOfResourceBasePaths = this.resourceBasePaths.length;
    });
    this.wadlService.loadLIST_SERVICES().pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.wadlService.setLIST_SERVICES(data);
      this.NoOfResourceBasePaths = this.resourceBasePaths.length;
    });
  }

  loadDynamicTables() {
    this.wadlService.loadTABLE_BASE_RESOURCES().pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.wadlService.setTABLE_BASE_RESOURCES(data);
      this.baseResourcesTable = data;
    });
    this.wadlService.loadTABLE_SERVICES().pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.wadlService.setTABLE_SERVICES(data);
      this.servicesTable = data;
    });
  }

  getDropdowns() {
    this.resourceBasePaths = this.wadlService.getLIST_BASE_RESOURCES();
    this.NoOfResourceBasePaths = this.resourceBasePaths.length;
    this.servicePaths = this.wadlService.getLIST_SERVICES();
    this.NoOfServices = this.servicePaths.length;
    this.methods = this.wadlService.getLIST_OF_METHODS();
    this.parameterTypes = this.wadlService.getLIST_OF_PARAMETER_TYPES();
    this.responseCodes = this.wadlService.getLIST_OF_RESPONSE_CODES();
    this.tboxes = [];
    let prefixes = this.nameService.getPrefixes()
    for (let i = 0; i < prefixes.length; i++) {
      if (prefixes[i].namespace.search('http://www.hsu-ifa.de') != -1) {
        this.tboxes.push(prefixes[i].namespace)
      }
    }
  }

  getTables() {
    let cols = ["VDI2206:System", "VDI2206:Module", "VDI3682:TechnicalResource"]
    let data = [this.vdi2206Service.getLIST_OF_SYSTEMS(), this.vdi2206Service.getLIST_OF_MODULES(), this.vdi3682Service.getLIST_OF_TECHNICAL_RESOURCES()]
    this.allVDIInfo = this.tableUtil.concatListsToTable(cols, data);
    this.allIsoEntityInfo = this.isoService.getTABLE_ALL_ENTITY_INFO();
    this.baseResourcesTable = this.wadlService.getTABLE_BASE_RESOURCES();
    this.servicesTable = this.wadlService.getTABLE_SERVICES();
  }



}