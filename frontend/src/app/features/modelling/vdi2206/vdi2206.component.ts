import { Component, OnInit } from '@angular/core';
import { Vdi2206ModelService, VDI2206INSERT, Tripel } from '../rdf-models/vdi2206Model.service';
import { take } from 'rxjs/operators';
import { DownloadService } from '@shared-services/backEnd/download.service';
import { DataLoaderService } from '@shared-services/dataLoader.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-vdi2206',
    templateUrl: './vdi2206.component.html',
    styleUrls: ['./vdi2206.component.scss']
})
export class Vdi2206Component implements OnInit {

    // util variables
    keys = Object.keys;
    currentTable: Array<Record<string, any>> = [];
    _currentOption: string;

    // stats
    systems$: Observable<Array<string>>;
    modules$: Observable<Array<string>>;
    components$: Observable<Array<string>>;

    // model data
    modelInsert = new VDI2206INSERT();

    // graph db data
    allStructureInfoContainmentbySys: any = [];
    allStructureInfoContainmentbyMod: any = [];
    allStructureInfoContainmentbyCOM: any = [];
    allStructureInfoInheritancebySys: any = [];
    allStructureInfoInheritancebyMod: any = [];
    allStructureInfoInheritancebyCOM: any = [];
    allClasses: any;
    allPatternComment: any;

    //user input variables
    newSubject: string;
    newPredicate = "rdf:type";
    newObject: string;

    selectedClass: string;
    selectedSubject: string;
    selectedPredicate: string;
    selectedObject: string;
    selectedObjectClass: string;
    existingObjectClasses: Array<string>;
    existingPredicates: Array<string>;
    existingObjects: Array<string>;
    insertUrl: string;

    StructureOptions: string;

    constructor(
        private dlService: DownloadService,
        private vdi2206Service: Vdi2206ModelService,
        private loadingScreenService: DataLoaderService
    ) {

    }

    ngOnInit(): void {
        this.allClasses = this.vdi2206Service.getListOfClasses();
        this.getAllStructuralInfo();
        this.getStatisticInfo();
        this._currentOption = 'System_BUTTON';
        this.setTableOption(this._currentOption);
    }



    buildInsert(structureOption: string): void  {
        const triples = this.getTriples(structureOption);
        const insertString = this.vdi2206Service.buildTripel(triples);
        const blob = new Blob([insertString], { type: 'text/plain' });
        const name = 'insert.txt';
        this.dlService.download(blob, name);
    }
    executeInsert(structureOption: string): void  {
        const triples = this.getTriples(structureOption);
        console.log(triples);
        this.vdi2206Service.insertTripel(triples).subscribe((data: any) => {
            this.loadingScreenService.stopLoading();
            this.setAllStructuralInfo();
            this.selectedPredicate = undefined;
            this.selectedObjectClass = undefined;
            this.selectedObject = undefined;
            this.existingObjectClasses = undefined;
            this.existingObjects = undefined;
        });
    }

    getObjectClasses(): void  {
        if (this.selectedPredicate) {

            const predicate = this.selectedPredicate;
            this.vdi2206Service.getRangeClasses(predicate).pipe(take(1)).subscribe((data: any) => {
                this.loadingScreenService.stopLoading();
                this.existingObjectClasses = data;
                this.selectedObjectClass = data[0];
            });
        }
    }


    getExistingObjects(): void  {

        if (this.selectedObjectClass) {
            const owlClass = this.selectedObjectClass;
            this.vdi2206Service.getIndividualsByClass(owlClass).pipe(take(1)).subscribe((data: any) => {
                this.loadingScreenService.stopLoading();
                this.existingObjects = data;
                this.selectedObject = data[0];
            });
        } else if (this.StructureOptions == "existingIndiInheritance" && this.selectedPredicate != undefined) {
            const subject = this.selectedSubject;
            this.vdi2206Service.getClassesOfIndividual(subject).pipe(take(1)).subscribe((data: any) => {
                this.loadingScreenService.stopLoading();
                const owlClass = data[0];
                this.vdi2206Service.getIndividualsByClass(owlClass).pipe(take(1)).subscribe((data: any) => {
                    this.loadingScreenService.stopLoading();
                    this.existingObjects = data;
                    this.selectedObject = data[0];
                });
            });
        }
    }

    tableClick(name: string): void  {
        this.selectedSubject = name;
        this.vdi2206Service.getClassesOfIndividual(this.selectedSubject).pipe(take(1)).subscribe((data: any) => {
            this.loadingScreenService.stopLoading();
            const owlClass = data[0];
            this.vdi2206Service.getPropertiesByDomain(owlClass).pipe(take(1)).subscribe((data: any) => {
                this.loadingScreenService.stopLoading();
                this.existingPredicates = data;
                this.selectedPredicate = data[0];
            });
        });
    }


    getAllStructuralInfo():void {
        //get containment info for sys
        this.allStructureInfoContainmentbySys = this.vdi2206Service.getTableStructuralInforByContainmentBySys();
        this.allStructureInfoContainmentbyMod = this.vdi2206Service.getTableStructuralInforByContainmentByMod();
        this.allStructureInfoContainmentbyCOM = this.vdi2206Service.getTableStructuralInforByContainmentByCom();
        this.allStructureInfoInheritancebySys = this.vdi2206Service.getTableStructuralInforByInheritanceBySys();
        this.allStructureInfoInheritancebyMod = this.vdi2206Service.getTableStructuralInforByInheritanceByMod();
        this.allStructureInfoInheritancebyCOM = this.vdi2206Service.getTableStructuralInforByInheritanceByCom();
    }

    setAllStructuralInfo(): void  {
        //set containment info for sys
        this.vdi2206Service.loadTableStructuralInfoByContainmentBySys().pipe(take(1)).subscribe((data: any) => {
            this.loadingScreenService.stopLoading();
            this.allStructureInfoContainmentbySys = data;
            this.vdi2206Service.setTableStructuralInfoByContainmentBySys(data);
            this.setTableOption(this._currentOption);
        });
        this.vdi2206Service.loadTableStructuralInfoByContainmentByMod().pipe(take(1)).subscribe((data: any) => {
            this.loadingScreenService.stopLoading();
            this.allStructureInfoContainmentbyMod = data;
            this.vdi2206Service.setTableStructuralInfoByContainmentByMod(data);
            this.setTableOption(this._currentOption);
        });
        this.vdi2206Service.loadTableStructuralInfoByContainmentByCom().pipe(take(1)).subscribe((data: any) => {
            this.loadingScreenService.stopLoading();
            this.allStructureInfoContainmentbyCOM = data;
            this.vdi2206Service.setTableStructuralInfoByContainmentByCom(data);
            this.setTableOption(this._currentOption);
        });
        this.vdi2206Service.loadTableStructuralInfoByInheritanceBySys().pipe(take(1)).subscribe((data: any) => {
            this.loadingScreenService.stopLoading();
            this.allStructureInfoInheritancebySys = data;
            this.vdi2206Service.setTableStructuralInfoByInheritanceBySys(data);
            this.setTableOption(this._currentOption);
        });
        this.vdi2206Service.loadTableStructuralInfoByInheritanceByMod().pipe(take(1)).subscribe((data: any) => {
            this.loadingScreenService.stopLoading();
            this.allStructureInfoInheritancebyMod = data;
            this.vdi2206Service.setTableStructuralInfoByInheritanceByMod(data);
            this.setTableOption(this._currentOption);
        });
        this.vdi2206Service.loadTableStructuralInfoByInheritanceByCom().pipe(take(1)).subscribe((data: any) => {
            this.loadingScreenService.stopLoading();
            this.allStructureInfoInheritancebyCOM = data;
            this.vdi2206Service.setTableStructuralInfoByInheritanceByCom(data);
            this.setTableOption(this._currentOption);
        });
    }

    getStatisticInfo(): void {
        // get stats of structure in TS
        this.systems$ = this.vdi2206Service.getSystems();
        this.modules$ = this.vdi2206Service.getModules();
        this.components$ = this.vdi2206Service.getComponents();
    }

    setTableOption(StructureTable: string): void  {

        switch (StructureTable) {
        case "System_BUTTON": {
            if(this.StructureOptions == "existingIndiInheritance"){this.currentTable = this.allStructureInfoInheritancebySys;}
            else {this.currentTable = this.allStructureInfoContainmentbySys;}
            this._currentOption = StructureTable;
            break;
        }
        case "Module_BUTTON": {
            if(this.StructureOptions == "existingIndiInheritance"){this.currentTable = this.allStructureInfoInheritancebyMod;}
            else {this.currentTable = this.allStructureInfoContainmentbyMod;}
            this._currentOption = StructureTable;
            break;
        }
        case "Component_BUTTON": {
            if(this.StructureOptions == "existingIndiInheritance"){this.currentTable = this.allStructureInfoInheritancebyCOM;}
            else {this.currentTable = this.allStructureInfoContainmentbyCOM;}
            this._currentOption = StructureTable;
            break;
        }
        default: {
            // no default statements
            break;
        }
        }
    }

    //  todo -> implement delete
    // deleteValue() {

    // }

    getTriples(structureOption: string): Tripel {
        if (structureOption == "newIndi") {
            return new Tripel(this.newSubject,this.newPredicate,this.selectedClass);
        } else if (structureOption == "existingIndiInheritance") {
            return new Tripel(this.selectedSubject,this.selectedPredicate,this.selectedObject);
        } else if (structureOption == "existingIndiContain") {
            return new Tripel(this.selectedSubject,this.selectedPredicate,this.selectedObject);
        }
    }

    setBack(): void {
        this.selectedSubject = undefined;
        this.selectedPredicate = undefined;
        this.selectedObject = undefined;
    }

    setStructureOption(option: string): void{
        this.StructureOptions = option;
        this.setTableOption(this._currentOption);
    }



}
