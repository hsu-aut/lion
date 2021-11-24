import { Component, OnInit, } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormArray } from '@angular/forms';
import { Validators } from '@angular/forms';

import { Dinen61360Service, DINEN61360Variables } from '../rdf-models/dinen61360Model.service';
import { Isa88ModelService } from '../rdf-models/isa88Model.service';
import { Vdi3682ModelService } from '../rdf-models/vdi3682Model.service';
import { Vdi2206ModelService } from '../rdf-models/vdi2206Model.service';
import { Iso22400_2ModelService } from '../rdf-models/iso22400_2Model.service';

import { EclassService } from '../../shared/services/backEnd/eclass.service';
import { PrefixesService } from '../../shared/services/prefixes.service';

import { DataLoaderService } from '../../shared/services/dataLoader.service';
import { MessagesService } from '../../shared/services/messages.service';
import { take } from 'rxjs/operators';
import { Tables } from '../utils/tables';


@Component({
    selector: 'app-dinen61360',
    templateUrl: './dinen61360.component.html',
    styleUrls: ['../../app.component.scss', './dinen61360.component.scss']
})
export class Dinen61360Component implements OnInit {
  // util variables
  keys = Object.keys;
  TableUtil = new Tables();
  _loaderShow = false;
  currentTable: Array<Record<string, any>> = [];
  instanceOption: string;
  tableTitle: string;
  tableSubTitle: string;
  _currentStructureOption: string;
  StructureOptions = "System_BUTTON";
  filterOption = true;

  // stats
  NoOfDE = 0;
  NoOfDET = 0;
  NoOfDEI = 0;

  // model variables
  modelVariables: DINEN61360Variables = {
      optionalTypeVariables:
    {
        Synonymous_Name: undefined,
        backwards_compatible_Revision: undefined,
        backwards_compatible_Version: undefined,
        Value_Format_Field_length: undefined,
        Value_Format_Field_length_Variable: undefined,
        Value_Format_non_quantitativ: undefined,
        Value_Format_quantitativ: undefined,
        Value_List: undefined,
        Value_List_Member: undefined,
        Source_Document_of_Definition: undefined,
        Synonymous_Letter_Symbol: undefined,
        Note: undefined,
        Remark: undefined,
        Preferred_Letter_Symbol: undefined,
        Formula: undefined,
        Drawing_Reference: undefined,
    },
      mandatoryTypeVariables: {
          typeIRI: undefined,
          code: undefined,
          version: undefined,
          revision: undefined,
          preferredName: undefined,
          shortName: undefined,
          definition: undefined,
          dataTypeIRI: undefined,
          unitOfMeasure: undefined
      },
      instanceVariables: {
          code: undefined,
          expressionGoalString: undefined,
          logicInterpretationString: undefined,
          valueString: undefined,
          describedIndividual: undefined
      }
  }
  // forms
  typeDescriptionForm = this.fb.group({
      code: [undefined, [Validators.required, Validators.pattern('([A-Z]{3})([0-9]{3})')]],
      version: [undefined, [Validators.required, Validators.pattern('([0-9]{1,})')]],
      revision: [undefined, [Validators.required, Validators.pattern('([0-9]{1,})')]],
      preferred_name: [undefined, [Validators.required, Validators.pattern('([A-Z;a-z; ;0-9]{1,})')]],
      short_name: [undefined, [Validators.required, Validators.pattern('([A-Z;a-z]{1,})')]],
      definition: [undefined, [Validators.required, Validators.pattern('([A-Z;a-z;  ]{1,})|([0-9]{1,})')]],
      dataType: [undefined, Validators.required],
      UoM: [undefined, [Validators.required, Validators.pattern('([A-Z;a-z]{1,})|([0-9]{0,})')]]
  })


  instanceDescriptionForm = this.fb.group({
      code: [undefined, [Validators.required, Validators.pattern('([A-Z]{3})([0-9]{3})')]],
      individual: [undefined, [Validators.required, Validators.pattern('(^((?!http).)*$)'), Validators.pattern('(^((?!://).)*$)')]],
      expressionGoal: [undefined, Validators.required],
      logicInterpretation: [undefined, Validators.required],
      value: [undefined, Validators.required]
  })

  eclassSearchForm = this.fb.group({
      searchTerm: [undefined],
  })

  // graph db data - DIN EN 61360
  allTypes: Array<Record<string, any>> = [];
  datatypes: Array<string> = [];
  allInstances: Array<Record<string, any>> = [];
  logicInterpretations: Array<string> = [];
  expressionGoals: Array<string> = [];

  insertString: string;
  customTable: Array<Record<string, any>>;
  selectString = this.nameService.getPrefixString() + "\n SELECT * WHERE { \n ?a ?b ?c. \n}";

  // graph db data VDI 3682
  allProcessInfo: Array<Record<string, any>> = [];


  // graph db data ISA 88
  allBehaviorInfo: Array<Record<string, any>> = [];

  //graph db data vdi2206
  allStructureInfoContainmentbySys: Array<Record<string, any>> = [];
  allStructureInfoContainmentbyMod: Array<Record<string, any>> = [];
  allStructureInfoContainmentbyCOM: Array<Record<string, any>> = [];
  allStructureInfoInheritancebySys: Array<Record<string, any>> = [];
  allStructureInfoInheritancebyMod: Array<Record<string, any>> = [];
  allStructureInfoInheritancebyCOM: Array<Record<string, any>> = [];
  structureTable: Array<Record<string, any>>;

  //graph db data iso 22400-2
  isoInfo: Array<Record<string, any>> = [];

  //eclass data from backend
  propertyList: Array<Record<string, any>> = [];

  constructor(
    private fb: FormBuilder,
    private eclass: EclassService,
    private nameService: PrefixesService,
    private dinen61360Service: Dinen61360Service,
    private vdi3682Service: Vdi3682ModelService,
    private isa88Service: Isa88ModelService,
    private loadingScreenService: DataLoaderService,
    private messageService: MessagesService,
    private vdi2206Service: Vdi2206ModelService,
    private isoService: Iso22400_2ModelService
  ) { }

  ngOnInit() {
      // get ProcessData
      this.getDropdowns();
      this.getTables();
      this.getStatisticInfo();

      this.structureTable = this.allStructureInfoContainmentbySys;
  }

  createTripel(action: string, context: string, form) {
      if (form.valid) {
          switch (context) {
          case "type": {
              const typeModelVariables = {
                  typeIRI: this.nameService.addOrParseNamespace(this.typeDescriptionForm.controls['code'].value),
                  code: this.typeDescriptionForm.controls['code'].value,
                  version: this.typeDescriptionForm.controls['version'].value,
                  revision: this.typeDescriptionForm.controls['revision'].value,
                  preferredName: this.typeDescriptionForm.controls['preferred_name'].value,
                  shortName: this.typeDescriptionForm.controls['short_name'].value,
                  definition: this.typeDescriptionForm.controls['definition'].value,
                  dataTypeIRI: this.nameService.parseToIRI(this.typeDescriptionForm.controls['dataType'].value),
                  unitOfMeasure: this.typeDescriptionForm.controls['UoM'].value
              };
              this.modelVariables.mandatoryTypeVariables = typeModelVariables;
              console.log(this.modelVariables);
              this.dinen61360Service.modifyType(action, this.modelVariables).pipe(take(1)).subscribe((data: any) => {
                  this.loadingScreenService.stopLoading();
                  this.setAllTypes();
                  this.setStatisticInfo();
              });
              console.log(action);
              console.log(form);
              break;
          }
          case "instance": {
              const instanceModelVariables = {
                  code: this.instanceDescriptionForm.controls['code'].value,
                  expressionGoalString: this.instanceDescriptionForm.controls['expressionGoal'].value,
                  logicInterpretationString: this.instanceDescriptionForm.controls['logicInterpretation'].value,
                  valueString: this.instanceDescriptionForm.controls['value'].value,
                  describedIndividual: this.nameService.addOrParseNamespace(this.instanceDescriptionForm.controls['individual'].value)
              };
              this.modelVariables.instanceVariables = instanceModelVariables;
              console.log(this.modelVariables);
              this.dinen61360Service.modifyInstance(action, this.modelVariables).pipe(take(1)).subscribe((data: any) => {
                  this.loadingScreenService.stopLoading();
                  this.setAllInstances();
                  this.setStatisticInfo();
              });
              console.log(action);
              console.log(form);
              break;
          }
          }
      } else if (form.invalid) {
          this.messageService.addMessage('error','Ups!','It seems like you are missing some data here...');
      }

  }

  typeTableClick(context, row) {
      switch (context) {
      case "type": {
          this.typeDescriptionForm.controls['code'].setValue(row.code);
          this.typeDescriptionForm.controls['version'].setValue(row.version);
          this.typeDescriptionForm.controls['revision'].setValue(row.revision);
          this.typeDescriptionForm.controls['preferred_name'].setValue(row.preferredName);
          this.typeDescriptionForm.controls['short_name'].setValue(row.shortName);
          this.typeDescriptionForm.controls['definition'].setValue(row.definition);
          this.typeDescriptionForm.controls['dataType'].setValue(row.dataType);
          this.typeDescriptionForm.controls['UoM'].setValue(row.unitOfMeasure);
          break;
      }
      case "instance": {
          this.instanceDescriptionForm.controls['code'].setValue(row.code);
          break;
      }
      }
  }

  anyTableClick(name: string) {
      this.instanceDescriptionForm.controls['individual'].setValue(name);
  }

  eclassSearch(searchForm: FormGroup, via: string) {
    this.eclass.getPropertyList(searchForm.controls['searchTerm'].value,via).pipe(take(1)).subscribe((rawlist: any) => {
      this.propertyList = rawlist;
    });
  }

  eclassTableClick(row) {
      this.typeDescriptionForm.controls['code'].setValue(row.Identifier);
      this.typeDescriptionForm.controls['version'].setValue(row.VersionNumber);
      this.typeDescriptionForm.controls['revision'].setValue(row.RevisionNumber);
      this.typeDescriptionForm.controls['preferred_name'].setValue(row.PreferredName);
      this.typeDescriptionForm.controls['definition'].setValue(row.Definition);
      this.typeDescriptionForm.controls['UoM'].setValue(row.DINNotation);

      // check for the data type of the eclass property
      const str = row.DataType.toLowerCase();
      for (let i = 0; i < this.datatypes.length; i++) {
          const element = this.nameService.parseToName(this.datatypes[i]);
          if (str.includes(element.toLowerCase())) {
              this.typeDescriptionForm.controls['dataType'].setValue(this.datatypes[i]);
          }
      }
      if (row.ShortName == "") {
          this.typeDescriptionForm.controls['short_name'].setValue(row.PreferredName.substring(0, 8));
      } else {
          this.typeDescriptionForm.controls['short_name'].setValue(row.ShortName);
      }
  }

  getDropdowns() {
      this.datatypes = this.dinen61360Service.getLIST_DATA_TYPES();
      this.logicInterpretations = this.dinen61360Service.getLIST_LOGIC_INTERPRETATIONS();
      this.expressionGoals = this.dinen61360Service.getLIST_EXPRESSION_GOALS();
  }

  getTables() {
      this.allProcessInfo = this.vdi3682Service.getALL_PROCESS_INFO_TABLE();
      this.allBehaviorInfo = this.isa88Service.getISA88BehaviorInfo();
      this.allTypes = this.dinen61360Service.getTABLE_All_TYPES();
      this.allInstances = this.dinen61360Service.getTABLE_ALL_INSTANCE_INFO();
      this.isoInfo = this.isoService.getTABLE_ALL_ENTITY_INFO();
      this.allStructureInfoContainmentbySys = this.vdi2206Service.getTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_SYS();
      this.allStructureInfoContainmentbyMod = this.vdi2206Service.getTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_MOD();
      this.allStructureInfoContainmentbyCOM = this.vdi2206Service.getTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_COM();
      this.allStructureInfoInheritancebySys = this.vdi2206Service.getTABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_SYS();
      this.allStructureInfoInheritancebyMod = this.vdi2206Service.getTABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_MOD();
      this.allStructureInfoInheritancebyCOM = this.vdi2206Service.getTABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_COM();
  }

  setAllTypes() {
      this.dinen61360Service.loadTABLE_All_TYPES().pipe(take(1)).subscribe((data: any) => {
          this.loadingScreenService.stopLoading();
          this.allTypes = data;
          this.dinen61360Service.setTABLE_All_TYPES(data);
      });
  }

  setAllInstances() {
      this.dinen61360Service.loadTABLE_ALL_INSTANCE_INFO().pipe(take(1)).subscribe((data: any) => {
          this.loadingScreenService.stopLoading();
          this.allInstances = data;
          this.dinen61360Service.setTABLE_ALL_INSTANCE_INFO(data);
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
          this.dinen61360Service.setLIST_All_DE(data);

      });
      this.dinen61360Service.loadLIST_All_DET().pipe(take(1)).subscribe((data: any) => {
          this.loadingScreenService.stopLoading();
          this.NoOfDET = data.length;
          this.dinen61360Service.setLIST_All_DET(data);
      });
      this.dinen61360Service.loadLIST_All_DEI().pipe(take(1)).subscribe((data: any) => {
          this.loadingScreenService.stopLoading();
          this.NoOfDEI = data.length;
          this.dinen61360Service.setLIST_All_DEI(data);
      });
  }

  getAllStructuralInfo() {
      //get containment info for sys
      this.allStructureInfoContainmentbySys = this.vdi2206Service.getTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_SYS();
      this.allStructureInfoContainmentbyMod = this.vdi2206Service.getTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_MOD();
      this.allStructureInfoContainmentbyCOM = this.vdi2206Service.getTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_COM();
  }
}

