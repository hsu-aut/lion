import { Component, OnInit } from '@angular/core';
import { PrefixesService } from '@shared-services/prefixes.service';
import { QueriesService } from '@shared-services/backEnd/queries.service';
import { Vdi3682ModelService } from '../../modelling/rdf-models/vdi3682Model.service';
import { Vdi2206ModelService } from '../../modelling/rdf-models/vdi2206Model.service';
import { Dinen61360Service } from '../../modelling/rdf-models/dinen61360Model.service';
import { Isa88ModelService } from '../../modelling/rdf-models/isa88Model.service';
import { WadlModelService } from '../../modelling/rdf-models/wadlModel.service';

import { DashboardService } from '@shared-services/dashboard.service';

import { TboxService } from '../../modelling/rdf-models/tbox.service';
import { Chart } from 'chart.js';
import { combineLatest, Observable } from 'rxjs';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],

})
export class DashboardComponent implements OnInit {
    // prefix object

    // VDI3682Table = [];
    // VDI2206Table = [];
    // DINEN61360Table = [];
    // ISA88Table = [];
    // WADLTable = [];

    // VDI3682_TITLE = "Available Processes in Database";
    // VDI3682_SUBTITLE = "Click on a cell to to use it for further descriptions.";
    // VDI2206_TITLE = "Available structural Elements in Database";
    // VDI2206_SUBTITLE = "Click on a cell to to use it for further descriptions.";
    // DINEN61360_TITLE = "Available Type Descriptions in Database";
    // DINEN61360_SUBTITLE = "Click on a cell to to use it for further descriptions.";
    // ISA88_TITLE = "Available state machine entities in Database";
    // ISA88_SUBTITLE = "Click on a cell to to use it for further descriptions.";
    // WADL_TITLE = "Existing Restful-Services in Database";
    // WADL_SUBTITLE = "Click on a cell to to use it for further descriptions.";

    // doughnut chart variables 
    numberOfClasses = 0;
    numberOfObjProperties = 0; 
    numberOfDataProperties = 0; 
    classChart;
    objPropertiesChart; 
    dataPropertiesChart; 

    namespaces: string[] = ["VDI3682", "DINEN61360", "VDI2206", "WADL", "OpcUa", "ISA88", "ISO22400-2"];

    // component UI variables
    numberOfTriples = 0;
    activeNamespace: string;

    // table var
    currentTable = [];
    tableTitle: string;
    tableSubTitle: string;
    filterOption = true;

    constructor(
        private namespaceService: PrefixesService,
        private query: QueriesService,
        private vdi3682Service: Vdi3682ModelService,
        private vdi2206Service: Vdi2206ModelService,
        private dinen61360Service: Dinen61360Service,
        private isa88Service: Isa88ModelService,
        private dashboardService: DashboardService,
        private wadlService: WadlModelService,
        private tboxServie: TboxService

    ) { }

    ngOnInit(): void {

        this.generateDoghnutClasses();  

        this.generateDoghnutObjProperties(); 

        this.generateDoghnutDataProperties(); 


        // for (const entry of this.namespacesNumberClasses.values()) {
        //     this.doughnutChartData.push(entry); 
        // }

        // console.log("My doughnut data [" + this.doughnutChartData + "]"); 

        /*      this.getChartData();
        this.setTableOption("VDI3682_BUTTON");
        this.vdi3682Service.getCompleteProcessInfo().subscribe(data => {
            this.VDI2206Table = data;
            this.currentTable = data;
        });
        this.VDI2206Table = this.vdi2206Service.getTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_SYS();
        this.wadlService.getBaseResources().pipe(take(1), toSparqlTable()).subscribe(data => this.WADLTable = data);
        this.isa88Service.getISA88BehaviorInfoTable().subscribe((data: Record<string, string>[]) => this.ISA88Table = data);
        this.dinen61360Service.getTableOfAllTypes().subscribe((data: Record<string, string>[]) => this.DINEN61360Table = data);
        this.getTriplesCount();
        this.getActiveNamespace(); */

    }

    public generateDoghnutClasses(): void {
        
        const $namespaces = new Array<Observable<string[]>>(); 

        for (const entry of this.namespaces) {
            $namespaces.push(this.tboxServie.getClassesWithinNamespace("http://www.hsu-ifa.de/ontologies/" + entry)); 

            // this.tboxServie.getClassesWithinNamespace("http://www.hsu-ifa.de/ontologies/" + entry).subscribe(data => {
            //     // this.namespacesNumberClasses.set(entry, data.length); 
            //     this.numberOfClasses += data.length;
            //     this.doughnutChartData.push(data.length); 
            // });
        }
        
        combineLatest($namespaces).subscribe(data => {
            const doughnutChartData = data.map(entry => entry.length);
            this.numberOfClasses = doughnutChartData.reduce((previousValue, currentValue) => previousValue += currentValue, 0); 
            this.classChart = new Chart('ClassChart', {
                type: 'doughnut',
                data: {
                    labels: this.namespaces,
                    datasets: [
                        {
                            data: doughnutChartData
                        }
                    ]
                }
            });
        }); 
    }

    public generateDoghnutObjProperties(): void {
        
        const $namespaces = new Array<Observable<string[]>>(); 

        for (const entry of this.namespaces) {
            $namespaces.push(this.tboxServie.getObjectPropertiesWithinNamespace("http://www.hsu-ifa.de/ontologies/" + entry)); 
        }
        
        combineLatest($namespaces).subscribe(data => {
            const doughnutChartData = data.map(entry => entry.length);
            this.numberOfObjProperties = doughnutChartData.reduce((previousValue, currentValue) => previousValue += currentValue, 0); 
            this.objPropertiesChart = new Chart('ObjPropsChart', {
                type: 'doughnut',
                data: {
                    labels: this.namespaces,
                    datasets: [
                        {
                            data: doughnutChartData
                        }
                    ]
                }
            });
        }); 
    }

    public generateDoghnutDataProperties(): void {
        
        const $namespaces = new Array<Observable<string[]>>(); 

        for (const entry of this.namespaces) {
            $namespaces.push(this.tboxServie.getDataPropertiesWithinNamespace("http://www.hsu-ifa.de/ontologies/" + entry)); 
        }
        
        combineLatest($namespaces).subscribe(data => {
            const doughnutChartData = data.map(entry => entry.length);
            this.numberOfDataProperties = doughnutChartData.reduce((previousValue, currentValue) => previousValue += currentValue, 0); 
            this.dataPropertiesChart = new Chart('DataPropsChart', {
                type: 'doughnut',
                data: {
                    labels: this.namespaces,
                    datasets: [
                        {
                            data: doughnutChartData
                        }
                    ]
                }
            });
        }); 
    }

    /*     refreshData() {
            this.doughnutChartType = 'doughnut';
            this.dashboardService.loadChartData().pipe(take(1)).subscribe((data: any) => {
                this.loadingScreenService.stopLoading();
                this.doughnutChartData = data.data;
                this.doughnutChartLabels = data.labels;
            });
            this.vdi3682Service.getCompleteProcessInfo().subscribe(data => this.VDI2206Table = data);
            this.VDI2206Table = this.vdi2206Service.getTABLE_STRUCTUAL_INFO_BY_CONTAINMENT_BY_SYS();
            this.isa88Service.getISA88BehaviorInfoTable().subscribe((data: Record<string, string>[]) => this.ISA88Table = data);
            this.dinen61360Service.getTableOfAllTypes().subscribe((data: any) => this.DINEN61360Table = data);
            this.getTriplesCount();
            this.getActiveNamespace();
        }
    
        getChartData() {
            this.doughnutChartData = this.dashboardService.getChartData().data;
            this.doughnutChartLabels = this.dashboardService.getChartData().labels;
        }
    
        setTableOption(button) {
            switch (button) {
            case "VDI3682_BUTTON": {
                this.setTable(this.VDI3682Table);
                this.setTableTitles(this.VDI3682_TITLE, this.VDI3682_SUBTITLE);
                break;
            }
            case "VDI2206_BUTTON": {
                this.setTable(this.VDI2206Table);
                this.setTableTitles(this.VDI2206_TITLE, this.VDI2206_SUBTITLE);
                break;
            }
            case "DINEN61360_BUTTON": {
                this.setTable(this.DINEN61360Table);
                this.setTableTitles(this.DINEN61360_TITLE, this.DINEN61360_SUBTITLE);
                break;
            }
            case "ISA88_BUTTON": {
                this.setTable(this.ISA88Table);
                this.setTableTitles(this.ISA88_TITLE, this.ISA88_SUBTITLE);
                break;
            }
            case "WADL_BUTTON": {
                this.setTable(this.WADLTable);
                this.setTableTitles(this.WADL_TITLE, this.WADL_SUBTITLE);
                break;
            }
            default: {
                // no default statements
                break;
            }
            }
    
        }
    
        tableClick(individual) {
            const PREFIXES = this.namespaceService.getPrefixes();
    
            // if known prefix contained in individual, get related triples
            for (let i = 0; i < PREFIXES.length; i++) {
                if (individual.search(PREFIXES[i].prefix) != -1) {
                    this.query.getRelatedTriples(individual).pipe(take(1)).subscribe((data: any) => {
                        this.currentTable = data;
                        this.tableTitle = "Triples related to: " + '"' + individual + '"';
                        this.tableSubTitle = "Click on a cell to load triples related to this element.";
                    });
                }
            }
            // if http: or urn: is contained in individial, get related triples
            if (individual.search("http:") != -1 || individual.search("urn:") != -1) {
                this.query.getRelatedTriples(individual).pipe(take(1)).subscribe((data: any) => {
                    this.currentTable = data;
                    this.tableTitle = "Triples related to: " + '"' + individual + '"';
                    this.tableSubTitle = "Click on a cell to load triples related to this element.";
                });
            }
    
        }
    
        setTable(table) {
            this.currentTable = table;
        }
    
        setTableTitles(Title, Subtitle) {
            this.tableTitle = Title;
            this.tableSubTitle = Subtitle;
        }
    
        getTriplesCount() {
            this.numberOfTriples = 0;
            for (let i = 0; i < this.doughnutChartData.length; i++) {
                this.numberOfTriples = this.numberOfTriples + this.doughnutChartData[i];
            }
        }
    
        getActiveNamespace() {
            this.activeNamespace = this.namespaceService.getActiveNamespace().namespace;
        } */
}
