import { Component, OnInit, } from '@angular/core';
import { DINEN61360Variables, DINEN61360Data, DINEN61360Insert, expressionGoal, logicInterpretation, datatype } from '../../models/dinen61360Model';
import { VDI3682DATA, VDI3682INSERT, VDI3682VARIABLES } from '../../models/vdi3682Model';
import { ISA88Insert, ISA88Data, ISA88Variables } from '../../models/isa88Model';
import { SparqlQueriesService } from '../../services/sparql-queries.service';
import { EclassSearchService } from '../../services/eclass-search.service';
import { Namespace } from '../../utils/prefixes';
import { Tables } from '../../utils/tables'
import { DownloadService } from 'src/app/services/download.service';



@Component({
  selector: 'app-dinen61360',
  templateUrl: './dinen61360.component.html',
  styleUrls: ['./dinen61360.component.scss']
})
export class Dinen61360Component implements OnInit {
  // util variables
  keys = Object.keys;
  namespaceParser = new Namespace();
  TableUtil = new Tables();
  _loaderShow = true;


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
  modelData = new DINEN61360Data();
  din = new DINEN61360Insert();
  NoOfDE = 0;
  NoOfDET = 0;
  NoOfDEI = 0;
  physicalEntitiesByInheritance: any;
  physicalEntitiesByContainment: any;
  allExTypes: DINEN61360Data["IRI"] = [];
  allTypes: any;
  insertString: string;
  customReturn: any;
  selectString = this.namespaceParser.getPrefixString() + "\n SELECT * WHERE { \n ?a ?b ?c. \n}";

  // graph db data VDI 3682
  allProcessInfo: any = [];
  VDI3682modelData = new VDI3682DATA();
  VDI3682modelInsert = new ISA88Insert();
  VDI3682modelVariables = new ISA88Variables();

  // graph db data ISA 88
  allBehaviorInfo: any = [];
  ISAmodelData = new ISA88Data();
  ISAmodelInsert = new VDI3682INSERT();
  ISAmodelVariables = new VDI3682VARIABLES();

  //eclass data from backend
  propertyList = [];

  constructor(private query: SparqlQueriesService, private eclass: EclassSearchService, private dlService: DownloadService) { }

  ngOnInit() {
    // get ProcessData
    this.getAllProcessInfo();
    this.getAllTypes();
    this.getStatisticInfo();
    this.query.select(this.modelData.SPARQL_SELECT_physical_by_child).subscribe((data: any) => {
      // log + assign data and stop loader
      console.log(data);
      this._loaderShow = false;
      this.physicalEntitiesByInheritance = data;

      // parse prefixes where possible 
      this.namespaceParser.parseToPrefix(data);
    });



  }

  buildTypeInsert() {

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
    this.insertString = this.din.buildDINEN61360T(varia);


    const blob = new Blob([this.insertString], { type: 'text/plain' });
    // Dateiname
    const name = 'insert.txt';
    this.dlService.download(blob, name);

  }

  buildInstanceInsert() {
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
    this.insertString = this.din.buildDINEN61360I(varia);
    // new: Hamied -> Download insertString as .txt file
    // Blob
    const blob = new Blob([this.insertString], { type: 'text/plain' });
    // Dateiname
    const name = 'insert.txt';
    this.dlService.download(blob, name);
  }


  searchByPreferredName(search_name: string) {
    this._loaderShow = true;
    this.eclass.getPropertyList(search_name).subscribe((rawlist: any) => {
      this.propertyList = rawlist;
      this._loaderShow = false;
      console.log(rawlist);
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
    this.insertString = this.din.buildDINEN61360T(varia);
    this.query.insert(this.insertString).subscribe((data: any) => {
      console.log(data)
      this.getAllTypes();
      this.getStatisticInfo();
    });

  }
  insertDINEN61360I() {
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
    this.insertString = this.din.buildDINEN61360I(varia);
    this.query.insert(this.insertString).subscribe((data: any) => {
      this.getStatisticInfo();
    });
  }
  executeSelect(selectString) {
    this.query.select(selectString).subscribe((data: any) => {
      this.namespaceParser.parseToPrefix(data);
      this.customReturn = data;

    });
  }
  iriTableClick(name: string) {
    this.describedIndividual = name;
  }

  getAllProcessInfo() {
    this._loaderShow = true;
    this.query.select(this.VDI3682modelData.allProcessInfo).subscribe((data: any) => {
      this.namespaceParser.parseToPrefix(data);
      this.allProcessInfo = this.TableUtil.buildTable(data);
      this._loaderShow = false;
    });
  }
  getAllTypes() {
    this._loaderShow = true;
    this.query.select(this.modelData.SPARQL_SELECT_allTypes).subscribe((data: any) => {
      this._loaderShow = false;
      this.namespaceParser.parseToPrefix(data);
      this.allTypes = this.TableUtil.buildTable(data);
    });
  }
  getStatisticInfo() {
    // get stats of functions in TS
    this.query.select(this.modelData.SPARQL_SELECT_allDE).subscribe((data: any) => {
      this.namespaceParser.parseToPrefix(data);
      this.NoOfDE = this.TableUtil.buildTable(data).length;
    });
    this.query.select(this.modelData.SPARQL_SELECT_allDET).subscribe((data: any) => {
      this.namespaceParser.parseToPrefix(data);
      this.NoOfDET = this.TableUtil.buildTable(data).length;
    });
    this.query.select(this.modelData.SPARQL_SELECT_allDEI).subscribe((data: any) => {
      this.namespaceParser.parseToPrefix(data);
      this.NoOfDEI = this.TableUtil.buildTable(data).length;
    });
  }
}
