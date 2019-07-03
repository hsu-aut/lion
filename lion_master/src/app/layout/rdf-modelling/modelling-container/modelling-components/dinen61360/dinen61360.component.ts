import { Component, OnInit, } from '@angular/core';
import { Dinen61360Service, DINEN61360Insert, DINEN61360Variables, expressionGoal, logicInterpretation, datatype } from '../../../rdf-models/dinen61360Model.service';
import { Isa88ModelService } from '../../../rdf-models/isa88Model.service';
import { Vdi3682ModelService } from '../../../rdf-models/vdi3682Model.service';
import { Vdi2206ModelService } from '../../../rdf-models/vdi2206Model.service';
import { SparqlQueriesService } from '../../../rdf-models/services/sparql-queries.service';
import { EclassSearchService } from '../../../rdf-models/services/eclass-search.service';
import { PrefixesService } from '../../../rdf-models/services/prefixes.service';
import { Tables } from '../../../utils/tables';
import { DownloadService } from '../../../rdf-models/services/download.service';
import { DataLoaderService } from '../../../../../shared/services/dataLoader.service';

import { take } from 'rxjs/operators';

@Component({
  selector: 'app-dinen61360',
  templateUrl: './dinen61360.component.html',
  styleUrls: ['./dinen61360.component.scss']
})
export class Dinen61360Component implements OnInit {
  // util variables
  keys = Object.keys;
  TableUtil = new Tables();
  _loaderShow = false;
  currentTable: Array<Object> = [];
  instanceOption: string;
  tableTitle: string;
  tableSubTitle: string;
  _currentStructureOption: string;
  StructureOptions: string = "System_BUTTON";

  // 61360 input form variables
  code: string;
  version: string;
  revision: string;
  preferred_name: string;
  short_name: string;
  definition: string;
  UoM: string;

  Synonymous_Name: string;
  backwards_compatible_Revision: string;
  backwards_compatible_Version: string;
  Value_Format_Field_length: string;
  Value_Format_Field_length_Variable: string;
  Value_Format_non_quantitativ: string;
  Value_Format_quantitativ: string;
  Value_List: string;
  Value_List_Member: string;
  Source_Document_of_Definition: string;
  Synonymous_Letter_Symbol: string;
  Note: string;
  Remark: string;
  Preferred_Letter_Symbol: string;
  Formula: string;
  Drawing_Reference: string;

  describedIndividual: string;
  selectedExpressionGoal: any;
  expressionGoal = expressionGoal;
  selectedLogicInterpretation: any;
  logicInterpretation = logicInterpretation;
  selectedDataytpe: any;
  datatype = datatype;
  value: string;

  // graph db data - DIN EN 61360
  din = new DINEN61360Insert();
  NoOfDE = 0;
  NoOfDET = 0;
  NoOfDEI = 0;
  allExTypes: Array<Object> = [];
  allTypes: any;
  insertString: string;
  customTable: Array<Object>;
  selectString = this.namespaceParser.getPrefixString() + "\n SELECT * WHERE { \n ?a ?b ?c. \n}";

  // graph db data VDI 3682
  allProcessInfo: any = [];

  // graph db data ISA 88
  allBehaviorInfo: any = [];

  //graph db data vdi2206
  allStructureInfoContainmentbySys: any = [];
  allStructureInfoContainmentbyMod: any = [];
  allStructureInfoContainmentbyCOM: any = [];
  allStructureInfoInheritancebySys: any = [];
  allStructureInfoInheritancebyMod: any = [];
  allStructureInfoInheritancebyCOM: any = [];
  structureTable: Array<Object>;

  //eclass data from backend
  propertyList = [];

  constructor(
    private query: SparqlQueriesService,
    private eclass: EclassSearchService,
    private dlService: DownloadService,
    private namespaceParser: PrefixesService,
    private dinen61360Service: Dinen61360Service,
    private vdi3682Service: Vdi3682ModelService,
    private isa88Service: Isa88ModelService,
    private loadingScreenService: DataLoaderService,
    private vdi2206Service: Vdi2206ModelService
  ) { }

  ngOnInit() {
    // get ProcessData
    this.getAllProcessInfo();
    this.getAllTypes();
    this.getStatisticInfo();
    this.getAllBehaviorInfo();
    this.getAllStructuralInfo();
    this.structureTable = this.allStructureInfoContainmentbySys;
  }

  buildTypeInsert() {
    var varia = this.getVariables();
    this.insertString = this.dinen61360Service.buildDET(varia);
    const blob = new Blob([this.insertString], { type: 'text/plain' });
    const name = 'insert.txt';
    this.dlService.download(blob, name);

  }

  buildInstanceInsert() {
    var varia = this.getVariables();
    this.insertString = this.dinen61360Service.buildDEI(varia);
    const blob = new Blob([this.insertString], { type: 'text/plain' });
    const name = 'insert.txt';
    this.dlService.download(blob, name);
  }


  searchByPreferredName(search_name: string) {
    this._loaderShow = true;
    this.eclass.getPropertyList(search_name).pipe(take(1)).subscribe((rawlist: any) => {
      this.propertyList = rawlist;
      this._loaderShow = false;
      this.currentTable = this.propertyList;
    });
  }

  eclassTableClick(row) {
    this.code = row.Identifier;
    this.version = row.VersionNumber;
    this.revision = row.RevisionNumber;
    this.preferred_name = row.PreferredName;
    this.short_name = row.ShortName;
    this.definition = row.Definition;

    var str = row.DataType.toLowerCase();
    for (const key in datatype) {
      if (datatype.hasOwnProperty(key)) {
        const element = datatype[key].toString();
        if (str.includes(element.toLowerCase())) {
          this.selectedDataytpe = element;
        }
      }
    }

    if (row.ShortName == "") {
      this.short_name = row.PreferredName.substring(0, 8)
    } else {
      this.short_name = row.ShortName;
    }
    this.UoM = row.DINNotation;
  }

  propertyTableClick(row) {
    this.code = row.ID;
  }
  insertDINEN61360T() {
    var varia = this.getVariables();
    this.dinen61360Service.insertDET(varia).pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.setAllTypes();
      this.setStatisticInfo();
    });

  }
  insertDINEN61360I() {
    var varia = this.getVariables();
    this.dinen61360Service.insertDEI(varia).pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.setStatisticInfo();
    });

  }

  executeSelect(selectString) {
    this.query.selectTable(selectString).pipe(take(1)).subscribe((data: any) => {
      this.customTable = data;
      this.setTableDescription(this.instanceOption);
    });
  }

  iriTableClick(name: string) {
    this.describedIndividual = name;
  }


  getAllProcessInfo() {
    this.allProcessInfo = this.vdi3682Service.getALL_PROCESS_INFO_TABLE();
  }

  getAllBehaviorInfo() {
    this.allBehaviorInfo = this.isa88Service.getISA88BehaviorInfo();
  }

  getAllTypes() {
    this.allTypes = this.dinen61360Service.getTABLE_All_TYPES();
  }

  setAllTypes() {
    this.dinen61360Service.loadTABLE_All_TYPES().pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.allTypes = data;
      this.dinen61360Service.setTABLE_All_TYPES(data)
    });
  }


  getStatisticInfo() {
    // get stats of functions in TS
    this.NoOfDE = this.dinen61360Service.getLIST_All_DE().length;
    this.NoOfDET = this.dinen61360Service.getLIST_All_DET().length;
    this.NoOfDEI = this.dinen61360Service.getLIST_All_DEI().length;
  }

  setStatisticInfo() {

    // set stats of functions in TS
    this.dinen61360Service.loadLIST_All_DE().pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.NoOfDE = data.length;
      this.dinen61360Service.setLIST_All_DE(data)

    });
    this.dinen61360Service.loadLIST_All_DET().pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.NoOfDET = data.length;
      this.dinen61360Service.setLIST_All_DET(data)
    });
    this.dinen61360Service.loadLIST_All_DEI().pipe(take(1)).subscribe((data: any) => {
      this.loadingScreenService.stopLoading();
      this.NoOfDEI = data.length;
      this.dinen61360Service.setLIST_All_DEI(data)
    });
  }


  getVariables() {
    var varia: DINEN61360Variables = {
      optionalTypeVariables:
      {
        Synonymous_Name: this.Synonymous_Name,
        backwards_compatible_Revision: this.backwards_compatible_Revision,
        backwards_compatible_Version: this.backwards_compatible_Version,
        Value_Format_Field_length: this.Value_Format_Field_length,
        Value_Format_Field_length_Variable: this.Value_Format_Field_length_Variable,
        Value_Format_non_quantitativ: this.Value_Format_non_quantitativ,
        Value_Format_quantitativ: this.Value_Format_quantitativ,
        Value_List: this.Value_List,
        Value_List_Member: this.Value_List_Member,
        Source_Document_of_Definition: this.Source_Document_of_Definition,
        Synonymous_Letter_Symbol: this.Synonymous_Letter_Symbol,
        Note: this.Note,
        Remark: this.Remark,
        Preferred_Letter_Symbol: this.Preferred_Letter_Symbol,
        Formula: this.Formula,
        Drawing_Reference: this.Drawing_Reference,
      },
      mandatoryTypeVariables: {
        code: this.code,
        version: this.version,
        revision: this.revision,
        preferredName: this.preferred_name,
        shortName: this.short_name,
        definition: this.definition,
        datatypeString: this.selectedDataytpe,
        unitOfMeasure: this.UoM
      },
      instanceVariables: {
        expressionGoalString: this.selectedExpressionGoal,
        logicInterpretationString: this.selectedLogicInterpretation,
        valueString: this.value,
        describedIndividual: this.describedIndividual
      }
    }
    return varia
  }

  getAllStructuralInfo() {
    //get containment info for sys
    this.allStructureInfoContainmentbySys = this.vdi2206Service.getTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_SYS();
    this.allStructureInfoContainmentbyMod = this.vdi2206Service.getTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_MOD();
    this.allStructureInfoContainmentbyCOM = this.vdi2206Service.getTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_COM();
    this.allStructureInfoInheritancebySys = this.vdi2206Service.getTABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_SYS();
    this.allStructureInfoInheritancebyMod = this.vdi2206Service.getTABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_MOD();
    this.allStructureInfoInheritancebyCOM = this.vdi2206Service.getTABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_COM();
  }

  setTableDescription(option) {
    this.instanceOption = option;
    if (this.instanceOption == "allTypeDescriptions") {
      this.tableTitle = "Available Type Descriptions in Database";
      this.tableSubTitle = "Click on a row to create an instance of this type description.";
    } else if (this.instanceOption == "allProcessTable") {
      this.tableTitle = "Available Process Description Entities in Database";
      this.tableSubTitle = "Click on a row to asign a data element to it.";
    } else if (this.instanceOption == "ISA88") {
      this.tableTitle = "Available Behavior Entities in Database";
      this.tableSubTitle = "Click on a row to asign a data element to it.";
    } else if (this.instanceOption == "CustomTable") {
      this.tableTitle = "Return of custom Query";
      this.tableSubTitle = "Click on a row to asign a data element to it.";
    } else if (this.instanceOption == "structureTable") {
      this.tableTitle = "Availeable structural Entities in Database";
      this.tableSubTitle = "Click on a row to asign a data element to it.";
    } else if (this.instanceOption == undefined) {
      this.tableTitle = undefined;
      this.tableSubTitle = undefined;
    }
  }

  setStructureTable(StructureTable: string) {
    switch (StructureTable) {
      case "System_BUTTON": {
        if (this.StructureOptions == "existingEntitiesInheritance") { this.currentTable = this.allStructureInfoInheritancebySys; }
        else { this.structureTable = this.allStructureInfoContainmentbySys; }
        this._currentStructureOption = StructureTable;
        break;
      }
      case "Module_BUTTON": {
        if (this.StructureOptions == "existingEntitiesInheritance") { this.currentTable = this.allStructureInfoInheritancebyMod; }
        else { this.structureTable = this.allStructureInfoContainmentbyMod; }
        this._currentStructureOption = StructureTable;
        break;
      }
      case "Component_BUTTON": {
        if (this.StructureOptions == "existingEntitiesInheritance") { this.currentTable = this.allStructureInfoInheritancebyCOM; }
        else { this.structureTable = this.allStructureInfoContainmentbyCOM; }
        this._currentStructureOption = StructureTable;
        break;
      }
      default: {
        // no default statements
        break;
      }
    }

  }
}

