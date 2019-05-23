import { Component, OnInit } from '@angular/core';
import { SparqlQueriesService} from '../../../rdf-models/services/sparql-queries.service';
import { WADLDATA, WADLINSERT, WADLVARIABLES } from '../../../rdf-models/wadl';
import { Namespace} from '../../../utils/prefixes';
import { Tables } from '../../../utils/tables';
import { DownloadService } from '../../../rdf-models/services/download.service';



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
  namespaceParser = new Namespace();
  TableUtil = new Tables();


  // model data
  modelData = new WADLDATA();
  modelInsert = new WADLINSERT();
  modelVariables = new WADLVARIABLES();



  constructor(private query: SparqlQueriesService, private dlService: DownloadService) {


  }


  ngOnInit() {
    // Temporäre Variable um Parameter Matrix, Plain und Template auszustellen
    var turnOnParameters = false;
    //Abfrage welche Methoden verfügbar sind (T-Box)
    this.query.select(this.modelData.availableMethods).subscribe((data: any) => {
      this.namespaceParser.parseToPrefix(data);
      console.log(data);
      this.allAvailableMethods = data;
      console.log(this.allAvailableMethods)
      // parse prefixes where possible 
    });

    this.updateResourceTable();
  }

  // Tabelle mit verfügbaren Ressourcen
  updateResourceTable() {
    this.query.select(this.modelData.availableResources).subscribe((data: any) => {
      this.namespaceParser.parseToPrefix(data);
      this.availableResources = this.TableUtil.buildTable(data);
      console.log(this.availableResources)
    });
  };

  //Tabellenfunktion 
  resourceTableClick(baseUrl: string, resource: string) {
    this.baseUrl = baseUrl;
    this.resource = resource;
  };

  buildResourceInsert() {
    this.modelVariables.mandatoryInformations = {
      baseUrl: this.baseUrl,
      resourceName: this.resource,
      method: this.namespaceParser.parseToName(this.selectedMethod)
    };
    var insertString = this.modelInsert.createEntity(this.modelVariables.mandatoryInformations);
    const blob = new Blob([insertString], { type: 'text/plain' });
    const name = 'wadlInsert.txt';
    this.dlService.download(blob, name);
  };

  executeInsertResoruce() {
    this.modelVariables.mandatoryInformations = {
      baseUrl: this.baseUrl,
      resourceName: this.resource,
      method: this.namespaceParser.parseToName(this.selectedMethod)
    };
    var insertString = this.modelInsert.createEntity(this.modelVariables.mandatoryInformations);
    this.query.insert(insertString).subscribe((data: any) => {
      console.log(data);
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
      method: this.namespaceParser.parseToName(this.selectedMethod)
    };
    var insertString = this.modelInsert.createEntityWithModel(this.modelVariables.mandatoryInformations, this.modelIri);
    const blob = new Blob([insertString], { type: 'text/plain' });
    const name = 'wadlInsert.txt';
    this.dlService.download(blob, name);
  };

  executeInsertResourceWithModel() {
    this.modelVariables.mandatoryInformations = {
      baseUrl: this.baseUrl,
      resourceName: this.resource,
      method: this.namespaceParser.parseToName(this.selectedMethod)
    };
    var insertString = this.modelInsert.createEntityWithModel(this.modelVariables.mandatoryInformations, this.modelIri);
    this.query.insert(insertString).subscribe((data: any) => {
      console.log(data);
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
      method: this.namespaceParser.parseToName(this.selectedMethod)
    };
    this.query.select(this.modelData.getAllParamtersTemp(this.modelVariables.mandatoryInformations)).subscribe((data: any) => {
      this.namespaceParser.parseToPrefix(data);
      this.availableParameters = this.TableUtil.buildTable(data);
      console.log(this.availableParameters)
    });
  };

  updateQueryParameterTable() {
    this.selectedParameter = 'query';
    this.modelVariables.mandatoryInformations = {
      baseUrl: this.baseUrl,
      resourceName: this.resource,
      method: this.namespaceParser.parseToName(this.selectedMethod)
    };
    this.query.select(this.modelData.getQueryParameters(this.modelVariables.mandatoryInformations)).subscribe((data: any) => {
      this.namespaceParser.parseToPrefix(data);
      this.availableParameters = this.TableUtil.buildTable(data);
      console.log(this.availableParameters)
    });
  };

  buildQueryParameterInsert() {
    this.modelVariables.mandatoryInformations = {
      baseUrl: this.baseUrl,
      resourceName: this.resource,
      method: this.namespaceParser.parseToName(this.selectedMethod)
    };
    this.modelVariables.parameterInfo = {
      paramName: this.queryParameterName,
      paramType: this.queryParameterType,
      optionValue: this.queryParameterValue
    };
    var insertString = this.modelInsert.createQueryParameter(this.modelVariables.mandatoryInformations, this.modelVariables.parameterInfo);

    const blob = new Blob([insertString], { type: 'text/plain' });
    // Dateiname
    const name = 'wadlInsert.txt';
    this.dlService.download(blob, name);
  };
 
  queryTableClick(key: string, type: string) {
    this.queryParameterName = key;
    this.queryParameterType = type;
  };

  executeQueryParameterInsert() {
    this.modelVariables.mandatoryInformations = {
      baseUrl: this.baseUrl,
      resourceName: this.resource,
      method: this.namespaceParser.parseToName(this.selectedMethod)
    };
    this.modelVariables.parameterInfo = {
      paramName: this.queryParameterName,
      paramType: this.queryParameterType,
      optionValue: this.queryParameterValue
    };
    var insertString = this.modelInsert.createQueryParameter(this.modelVariables.mandatoryInformations, this.modelVariables.parameterInfo);

    this.query.insert(insertString).subscribe((data: any) => {
      console.log(data);
      this.updateQueryParameterTable();
    });

  };



  updateHeaderParameterTable() {
    this.selectedParameter = 'header';
    this.modelVariables.mandatoryInformations = {
      baseUrl: this.baseUrl,
      resourceName: this.resource,
      method: this.namespaceParser.parseToName(this.selectedMethod)
    };
    this.query.select(this.modelData.getHeaderParamters(this.modelVariables.mandatoryInformations)).subscribe((data: any) => {
      this.namespaceParser.parseToPrefix(data);
      this.availableParameters = this.TableUtil.buildTable(data);
      console.log(this.availableParameters);
    });
  };

  buildHeaderParameterInsert() {
    this.modelVariables.mandatoryInformations = {
      baseUrl: this.baseUrl,
      resourceName: this.resource,
      method: this.namespaceParser.parseToName(this.selectedMethod)
    };

    var insertString = this.modelInsert.createHeaderParameter(this.modelVariables.mandatoryInformations, this.headerParameterKey, this.headerParameterMediaType);
    const blob = new Blob([insertString], { type: 'text/plain' });
    // Dateiname
    const name = 'wadlInsert.txt';
    this.dlService.download(blob, name);
  };

  executeHeaderParameterInsert() {
    this.modelVariables.mandatoryInformations = {
      baseUrl: this.baseUrl,
      resourceName: this.resource,
      method: this.namespaceParser.parseToName(this.selectedMethod)
    };

    var insertString = this.modelInsert.createHeaderParameter(this.modelVariables.mandatoryInformations,this.headerParameterKey, this.headerParameterMediaType);

    this.query.insert(insertString).subscribe((data: any) => {
      console.log(data);
      this.updateHeaderParameterTable();
    });

  };

  
  headerTableClick(key: string, type: string) {
    this.headerParameterKey = key;
    this.headerParameterMediaType = type;
  };


}
