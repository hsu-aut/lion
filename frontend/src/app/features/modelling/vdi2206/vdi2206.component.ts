import { Component, OnInit } from '@angular/core';
import { Vdi2206ModelService, VDI2206INSERT, Tripel } from '../rdf-models/vdi2206Model.service';
import { take } from 'rxjs/operators';
import { DownloadService } from '@shared-services/backEnd/download.service';
import { DataLoaderService } from '@shared-services/dataLoader.service';
import { Observable } from 'rxjs';
import { toSparqlTable, toSparqlVariableList } from '../utils/rxjs-custom-operators';
import { TboxService } from '../rdf-models/tbox.service';

@Component({
    selector: 'app-vdi2206',
    templateUrl: './vdi2206.component.html',
    styleUrls: ['./vdi2206.component.scss']
})
export class Vdi2206Component implements OnInit {

    private readonly namespace = "http://www.hsu-ifa.de/ontologies/VDI2206#";

    // util variables
    keys = Object.keys;
    currentTable$: Observable<Array<Record<string, any>>>;

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

    allPatternComment: any;


    selectedClass: string;
    selectedSubject: string;        // selected from the table and passed to children
    selectedPredicate: string;      // selected from the table and passed to children
    selectedObject: string;

    existingObjectClasses: Array<string>;
    existingPredicates: Array<string>;

    insertUrl: string;

    constructor(
        private dlService: DownloadService,
        private vdi2206Service: Vdi2206ModelService,
        private tboxService: TboxService
    ) {

    }

    ngOnInit(): void {
        this.getAllStructuralInfo();
        this.loadData();
        this.setTableOption("system");
    }


    private loadData() {
        this.systems$ = this.vdi2206Service.getSystems().pipe(toSparqlVariableList('system'));
        this.modules$ = this.vdi2206Service.getModules().pipe(toSparqlVariableList('module'));
        this.components$ = this.vdi2206Service.getComponents().pipe(toSparqlVariableList('component'));
    }


    tableClick($event): void  {
        const name = $event;
        this.selectedSubject = name;
        this.tboxService.getClassOfIndividualWithinNamespace(this.selectedSubject, this.namespace).pipe(take(1)).subscribe((data: any) => {
            const owlClass = data[0];
            this.tboxService.getPropertiesByDomain(owlClass).pipe(take(1)).subscribe((data: any) => {
                this.existingPredicates = data;
                this.selectedPredicate = data[0];
            });
        });
    }


    getAllStructuralInfo():void {
        //get containment info for sys
        // this.allStructureInfoContainmentbySys = this.vdi2206Service.getTableStructuralInforByContainmentBySys();
        // this.allStructureInfoContainmentbyMod = this.vdi2206Service.getTableStructuralInforByContainmentByMod();
        // this.allStructureInfoContainmentbyCOM = this.vdi2206Service.getTableStructuralInforByContainmentByCom();
        // this.allStructureInfoInheritancebySys = this.vdi2206Service.getTableStructuralInforByInheritanceBySys();
        // this.allStructureInfoInheritancebyMod = this.vdi2206Service.getTableStructuralInforByInheritanceByMod();
        // this.allStructureInfoInheritancebyCOM = this.vdi2206Service.getTableStructuralInforByInheritanceByCom();
    }


    setTableOption(structuralType: string): void  {
        switch (structuralType) {
        case "system": {
            this.currentTable$ = this.vdi2206Service.getSystems().pipe(toSparqlTable());
            // if(this.StructureOptions == "existingIndiInheritance"){
            //     this.currentTable = this.allStructureInfoInheritancebySys;}
            // else {this.currentTable = this.allStructureInfoContainmentbySys;}
            break;
        }
        case "module": {
            this.currentTable$ = this.vdi2206Service.getModules().pipe(toSparqlTable());
            // if(this.StructureOptions == "existingIndiInheritance"){this.currentTable = this.allStructureInfoInheritancebyMod;}
            // else {this.currentTable = this.allStructureInfoContainmentbyMod;}
            break;
        }
        case "component": {
            this.currentTable$ = this.vdi2206Service.getModules().pipe(toSparqlTable());
            // if(this.StructureOptions == "existingIndiInheritance"){this.currentTable = this.allStructureInfoInheritancebyCOM;}
            // else {this.currentTable = this.allStructureInfoContainmentbyCOM;}
            break;
        }
        default: {
            // no default statements
            break;
        }
        }
    }

}
