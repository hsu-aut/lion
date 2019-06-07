import { Component, OnInit } from '@angular/core';
import { SparqlQueriesService } from '../../../rdf-models/services/sparql-queries.service';
import { WadlModelService, WADLVARIABLES, WADLDATA, WADLINSERT} from '../../../rdf-models/wadlModel.service';
import { Vdi3682ModelService} from '../../../rdf-models/vdi3682Model.service';

import { PrefixesService } from '../../../rdf-models/services/prefixes.service';
import { Tables } from '../../../utils/tables';
import { DownloadService } from '../../../rdf-models/services/download.service';

import { DataLoaderService } from '../../../../../shared/services/dataLoader.service';


@Component({
  selector: 'app-wadl',
  templateUrl: './wadl.component.html',
  styleUrls: ['./wadl.component.scss']
})
export class WadlComponent implements OnInit {

  selectedParameter: string;

  // graph db data
  allAvailableMethods: any;
  availableResources: any;
  methodDoesNotExistYet: Boolean;

  availableTechnicalResources: any;

  //user input variables
  selectedMethod: string;
  baseUrl: string;
  resource: string;
  selectedParam: string;

  modelIri: string;

  //user input 4 new QueryParameters;
  queryParameterName: string;
  queryParameterType: string;
  queryParameterValue: string;

  // user input 4 HeaderParamters
  headerParameterKey: string;
  headerParameterMediaType: string;


  //Parametertable
  availableParameters: any;


  // util variables
  keys = Object.keys;
  //namespaceParser = new Namespace();
  TableUtil = new Tables();


  // model data
  modelData = new WADLDATA();
  modelInsert = new WADLINSERT();
  modelVariables = new WADLVARIABLES();



  constructor(private query: SparqlQueriesService,
    private dlService: DownloadService,
    private namespaceParser: PrefixesService,
    private modelService: WadlModelService,
    private vdi3682Service: Vdi3682ModelService,
    private loadingScreenService: DataLoaderService) {
  }


  ngOnInit() {
    this.allAvailableMethods = this.modelService.getLIST_OF_METHODS();
    console.log('StartWadl')
    this.availableResources = this.modelService.getTABLE_OF_RESOURCES();
    //this.updateResourceTable();
  }

  // Tabelle mit verfügbaren Ressourcen
  updateResourceTable() {
    this.availableResources = this.modelService.reloadTABLE_OF_RESOURCES();
  };

  //Tabellenfunktion 
  resourceTableClick(baseUrl: string, resource: string, modelIri: string) {
    if (baseUrl.length > 0) {
      this.baseUrl = baseUrl;
      this.resource = resource;
    } else {
      this.modelIri = modelIri;
    }
  };

  deleteServiceProvider(baseUrl: string, serviceProvider: string) {
    this.modelService.deleteServiceProvider(baseUrl, serviceProvider).subscribe((data: any) => {
      this.updateResourceTable();
    });
  }

  buildResourceInsert() {
    this.modelVariables.mandatoryInformations = {
      baseUrl: this.baseUrl,
      resourceName: this.resource,
      method: this.selectedMethod
    };
    const insertString = this.modelService.buildCreateEntity(this.modelVariables.mandatoryInformations);
    const blob = new Blob([insertString], { type: 'text/plain' });
    const name = 'wadlInsert.txt';
    this.dlService.download(blob, name);
  };

  executeInsertResoruce() {
    this.modelVariables.mandatoryInformations = {
      baseUrl: this.baseUrl,
      resourceName: this.resource,
      method: this.selectedMethod
    };
    this.modelService.insertCreateEntity(this.modelVariables.mandatoryInformations).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.updateResourceTable();
      if (this.selectedParameter === 'all') {
        this.updateAllParameterTable();
      };
      if (this.selectedParameter === 'query') {
        this.updateQueryParameterTable();
      };
      if (this.selectedParameter === 'header') {
        this.updateHeaderParameterTable();
      };
    });

  };

  buildResourceInsertWithModel() {
    this.modelVariables.mandatoryInformations = {
      baseUrl: this.baseUrl,
      resourceName: this.resource,
      method: this.selectedMethod
    };
    var insertString = this.modelService.buildCreateEntityWithModel(this.modelVariables.mandatoryInformations, this.modelIri)
    // var insertString2 = this.modelInsert.createEntityWithModel();
    const blob = new Blob([insertString], { type: 'text/plain' });
    const name = 'wadlInsert.txt';
    this.dlService.download(blob, name);
  };

  executeInsertResourceWithModel() {
    this.modelVariables.mandatoryInformations = {
      baseUrl: this.baseUrl,
      resourceName: this.resource,
      method: this.selectedMethod
    };
    this.modelService.insertCreateEntityWithModel(this.modelVariables.mandatoryInformations, this.modelIri).subscribe((data: any) => {
      this.updateResourceTable();
      if (this.selectedParameter === 'all') {
        this.updateAllParameterTable();
      };
      if (this.selectedParameter === 'query') {
        this.updateQueryParameterTable();
      };
      if (this.selectedParameter === 'header') {

        this.updateHeaderParameterTable();
      };
    });
  };


  updateAllParameterTable() {
    this.selectedParameter = 'all';
    this.modelVariables.mandatoryInformations = {
      baseUrl: this.baseUrl,
      resourceName: this.resource,
      method: this.selectedMethod
    };
    this.modelService.loadASK_METHOD_EXISTS(this.modelVariables.mandatoryInformations).subscribe((data: any) => {
      this.methodDoesNotExistYet = data.boolean;
    });

    this.modelService.loadTABLE_OF_ALL_PARAMETERS(this.modelVariables.mandatoryInformations).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.availableParameters = data;
    });
  };

  updateQueryParameterTable() {
    this.selectedParameter = 'query';
    this.modelVariables.mandatoryInformations = {
      baseUrl: this.baseUrl,
      resourceName: this.resource,
      method: this.selectedMethod
    };

    this.modelService.loadASK_METHOD_EXISTS(this.modelVariables.mandatoryInformations).subscribe((data: any) => {
      this.methodDoesNotExistYet = data.boolean;
    });

    this.modelService.loadTABLE_OF_QUERY_PARAMETERS(this.modelVariables.mandatoryInformations).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.availableParameters = data;
    });
  };

  buildQueryParameterInsert() {
    this.modelVariables.mandatoryInformations = {
      baseUrl: this.baseUrl,
      resourceName: this.resource,
      method: this.selectedMethod
    };
    this.modelVariables.parameterInfo = {
      paramName: this.queryParameterName,
      paramType: this.queryParameterType,
      optionValue: this.queryParameterValue
    };
    var insertString = this.modelService.buildCreateQueryParameter(this.modelVariables.mandatoryInformations, this.modelVariables.parameterInfo);
    const blob = new Blob([insertString], { type: 'text/plain' });
    const name = 'wadlInsert.txt';
    this.dlService.download(blob, name);
  };

  executeQueryParameterInsert() {
    this.modelVariables.mandatoryInformations = {
      baseUrl: this.baseUrl,
      resourceName: this.resource,
      method: this.selectedMethod
    };
    this.modelVariables.parameterInfo = {
      paramName: this.queryParameterName,
      paramType: this.queryParameterType,
      optionValue: this.queryParameterValue
    };
    this.modelService.insertCreateQueryParameter(this.modelVariables.mandatoryInformations, this.modelVariables.parameterInfo).subscribe((data: any) => {
      this.updateQueryParameterTable();
    });
  };

  queryTableClick(key: string, type: string) {
    this.queryParameterName = key;
    this.queryParameterType = type;
  };

  deleteFunction(action: string, key: string, type: string, optionValue: string) {
    this.modelVariables.mandatoryInformations = {
      baseUrl: this.baseUrl,
      resourceName: this.resource,
      method: this.namespaceParser.parseToName(this.selectedMethod)
    };
    this.modelVariables.parameterInfo = {
      paramName: key,
      paramType: type,
      optionValue: optionValue
    };

    if (action == "queryParameter") {
      this.modelService.deleteQueryParameter(this.modelVariables.mandatoryInformations,
        this.modelVariables.parameterInfo).subscribe((data: any) => {
          this.updateQueryParameterTable();
        });
    };

    if (action == "optionValue") {
      this.modelService.deleteQueryOptionValue(this.modelVariables.mandatoryInformations,
        this.modelVariables.parameterInfo).subscribe((data: any) => {
          this.updateQueryParameterTable();
        });
    };
    if (action == "parameterType") {
      this.modelService.deleteQueryParameterType(this.modelVariables.mandatoryInformations,
        this.modelVariables.parameterInfo).subscribe((data: any) => {
          this.updateQueryParameterTable();
        });
    };
    if (action == "headerParameter") {
      this.modelVariables.headerInformations = {
        key: key,
        mediaType: type
      }
      this.modelService.deleteHeaderParameter(this.modelVariables.mandatoryInformations, this.modelVariables.headerInformations).subscribe((data: any) => {
        this.updateHeaderParameterTable();
      });
    };
  };

  updateHeaderParameterTable() {
    this.selectedParameter = 'header';
    this.modelVariables.mandatoryInformations = {
      baseUrl: this.baseUrl,
      resourceName: this.resource,
      method: this.selectedMethod
    };

    this.modelService.loadASK_METHOD_EXISTS(this.modelVariables.mandatoryInformations).subscribe((data: any) => {
      this.methodDoesNotExistYet = data.boolean;
    });

    this.modelService.loadTABLE_OF_HEADER_PARAMETERS(this.modelVariables.mandatoryInformations).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.availableParameters = data;
    });
  };

  buildHeaderParameterInsert() {
    this.modelVariables.mandatoryInformations = {
      baseUrl: this.baseUrl,
      resourceName: this.resource,
      method: this.selectedMethod
    };
    this.modelVariables.headerInformations = {
      key: this.headerParameterKey,
      mediaType: this.headerParameterMediaType
    };
    var insertString = this.modelService.buildCreateHeaderParameter(this.modelVariables.mandatoryInformations,
      this.modelVariables.headerInformations);
    const blob = new Blob([insertString], { type: 'text/plain' });
    const name = 'wadlInsert.txt';
    this.dlService.download(blob, name);
  };

  executeHeaderParameterInsert() {
    this.modelVariables.mandatoryInformations = {
      baseUrl: this.baseUrl,
      resourceName: this.resource,
      method: this.selectedMethod
    };
    this.modelVariables.headerInformations = {
      key: this.headerParameterKey,
      mediaType: this.headerParameterMediaType
    };
    this.modelService.insertCreateHeaderParameter(this.modelVariables.mandatoryInformations,
      this.modelVariables.headerInformations).subscribe((data: any) => {
        this.updateHeaderParameterTable();
      });
  };

  headerTableClick(key: string, type: string) {
    this.headerParameterKey = key;
    this.headerParameterMediaType = type;
  };

  getAvailableTechnicalResources() {
    this.availableTechnicalResources = this.vdi3682Service.getLIST_OF_TECHNICAL_RESOURCES();
  };

  getAvailableStructureElements() {
    this.query.select(this.modelData.getStructureElements).subscribe((data: any) => {
      this.namespaceParser.parseToPrefix(data);
      this.availableTechnicalResources = this.TableUtil.buildTable(data);
    });
  };

  modelTableClick(selected: string) {
    this.modelIri = this.namespaceParser.parseToIRI(selected);
  };
}