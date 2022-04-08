import { Component, OnInit, } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';

import { Dinen61360Service } from '../rdf-models/dinen61360Model.service';
import { DINEN61360Variables } from '@shared/interfaces/dinen61360-variables.interface';
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
        code: [undefined, [Validators.required]],
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
    allProcessInfo = new Array<Record<string, any>>();


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
        private isoService: Iso22400_2ModelService,
    ) { }

    ngOnInit() {
        this.getDropdowns();
        this.getTables();
        this.getStatisticInfo();

        this.structureTable = this.allStructureInfoContainmentbySys;
    }

    createTriple(action: string, context: string, form) {
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
                    this.getTables();
                    this.getStatisticInfo();
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
                    this.getTables();
                    this.getStatisticInfo();
                });
                console.log(action);
                console.log(form);
                break;
            }
            }
        } else if (form.invalid) {
            this.messageService.addMessage('error', 'Ups!', 'It seems like you are missing some data here...');
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
        this.eclass.getPropertyList(searchForm.controls['searchTerm'].value, via).pipe(take(1)).subscribe((rawlist: any) => {
            this.propertyList = rawlist;
        });
    }

    eclassTableClick(row) {
        this.typeDescriptionForm.controls['code'].setValue(row.code);
        this.typeDescriptionForm.controls['version'].setValue(row.version);
        this.typeDescriptionForm.controls['revision'].setValue(row.revision);
        this.typeDescriptionForm.controls['preferred_name'].setValue(row.preferredName);
        this.typeDescriptionForm.controls['definition'].setValue(row.definition);
        this.typeDescriptionForm.controls['UoM'].setValue(row.unitShortName);

        // check for the data type of the eclass property
        const str = row.DataType.toLowerCase();
        for (let i = 0; i < this.datatypes.length; i++) {
            const element = this.nameService.parseToName(this.datatypes[i]);
            if (str.includes(element.toLowerCase())) {
                this.typeDescriptionForm.controls['dataType'].setValue(this.datatypes[i]);
            }
        }
        if (row.shortName == "" || row.shortName == " " || row.shortName == null) {
            this.typeDescriptionForm.controls['short_name'].setValue(row.preferredName.substring(0, 8));
        } else {
            this.typeDescriptionForm.controls['short_name'].setValue(row.shortName);
        }
    }

    getDropdowns(): void {
        this.dinen61360Service.getListOfDataTypes().pipe(take(1)).subscribe((data: any) => this.datatypes = data);
        this.dinen61360Service.getListOfLogicInterpretations().pipe(take(1)).subscribe((data: any) => this.logicInterpretations = data);
        this.dinen61360Service.getListOfExpressionGoals().pipe(take(1)).subscribe((data: any) => this.expressionGoals = data);
    }

    getTables(): void {
        // new code
        this.dinen61360Service.getTableOfAllTypes().pipe(take(1)).subscribe((data: any) => this.allTypes = data);
        this.dinen61360Service.getTableOfAllInstanceInfo().pipe(take(1)).subscribe((data: any) => this.allInstances = data);
        this.isoService.getTableOfAllEntityInfo().pipe(take(1)).subscribe((data: any) => this.isoInfo = data);
        // TODO: replace the remaining code as soon as vdi2206 model service etc. is updated
        this.allBehaviorInfo = this.isa88Service.getISA88BehaviorInfo();
        // this.isoInfo = this.isoService.getTABLE_ALL_ENTITY_INFO();
        this.allStructureInfoContainmentbySys = this.vdi2206Service.getTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_SYS();
        this.allStructureInfoContainmentbyMod = this.vdi2206Service.getTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_MOD();
        this.allStructureInfoContainmentbyCOM = this.vdi2206Service.getTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_COM();
        this.allStructureInfoInheritancebySys = this.vdi2206Service.getTABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_SYS();
        this.allStructureInfoInheritancebyMod = this.vdi2206Service.getTABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_MOD();
        this.allStructureInfoInheritancebyCOM = this.vdi2206Service.getTABLE_STRUCTUAL_INFO_BY_INHERITANCE_BY_COM();
        this.vdi3682Service.getCompleteProcessInfo().pipe(take(1)).subscribe(data => this.allProcessInfo = data);
        this.allBehaviorInfo = this.isa88Service.getISA88BehaviorInfo();
    }

    getStatisticInfo(): void {
        this.dinen61360Service.getListOfAllDET().pipe(take(1)).subscribe((data: any) => this.NoOfDET = data.length);
        this.dinen61360Service.getListOfAllDEI().pipe(take(1)).subscribe((data: any) => this.NoOfDEI = data.length);
        this.dinen61360Service.getListOfAllDE().pipe(take(1)).subscribe((data: any) => this.NoOfDE = data.length);
    }

    // setAllTypes() {
    //     this.dinen61360Service.getTableOfAllTypes().pipe(take(1)).subscribe((data: any) => {
    //         this.allTypes = data;
    //     });
    // }

    // setAllInstances() {
    //     this.dinen61360Service.getTableOfAllInstanceInfo().pipe(take(1)).subscribe((data: any) => {
    //         this.allInstances = data;
    //     });
    // }



    // setStatisticInfo() {
    //     this.dinen61360Service.getListOfAllDE().pipe(take(1)).subscribe((data: any) => {
    //         this.NoOfDE = data.length;
    //     });
    //     this.dinen61360Service.getListOfAllDET().pipe(take(1)).subscribe((data: any) => {
    //         this.NoOfDET = data.length;
    //     });
    //     this.dinen61360Service.getListOfAllDEI().pipe(take(1)).subscribe((data: any) => {
    //         this.NoOfDEI = data.length;
    //     });
    // }

    // getAllStructuralInfo() {
    //     this.allStructureInfoContainmentbySys = this.vdi2206Service.getTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_SYS();
    //     this.allStructureInfoContainmentbyMod = this.vdi2206Service.getTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_MOD();
    //     this.allStructureInfoContainmentbyCOM = this.vdi2206Service.getTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_COM();
    // }
}

