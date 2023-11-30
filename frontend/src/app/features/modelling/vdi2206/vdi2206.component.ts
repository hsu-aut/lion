import { Component, OnInit } from '@angular/core';
import { Vdi2206ModelService } from '../rdf-models/vdi2206Model.service';
import { Observable } from 'rxjs';
import { toSparqlTable, toSparqlVariableList } from '../utils/rxjs-custom-operators';

@Component({
    selector: 'app-vdi2206',
    templateUrl: './vdi2206.component.html',
    styleUrls: ['./vdi2206.component.scss']
})
export class Vdi2206Component implements OnInit {

    private readonly namespace = "http://www.w3id.org/hsu-aut/VDI2206#";

    // util variables
    currentTable$: Observable<Array<Record<string, any>>>;

    // stats
    numberOfSystems: number;
    numberOfModules: number;
    numberOfComponents: number;

    // selected from the table and passed to children
    selectedSubject: string;

    constructor(
        private vdi2206Service: Vdi2206ModelService,
    ) { }

    ngOnInit(): void {
        this.loadNumbers();
        this.setTableOption("system");
    }

    private loadNumbers() {
        this.vdi2206Service.getSystems().pipe(toSparqlVariableList('system')).subscribe((data => {
            const set = new Set(data);
            this.numberOfSystems = set.size;
        }));
        this.vdi2206Service.getModules().pipe(toSparqlVariableList('module')).subscribe((data => {
            const set = new Set(data);
            this.numberOfModules = set.size;
        }));
        this.vdi2206Service.getComponents().pipe(toSparqlVariableList('component')).subscribe((data => {
            const set = new Set(data);
            this.numberOfComponents = set.size;
        }));
    }


    tableClick($event): void  {
        const name = $event;
        this.selectedSubject = name;
    }

    setTableOption(structuralType: string): void  {
        switch (structuralType) {
        case "system": {
            this.currentTable$ = this.vdi2206Service.getSystems().pipe(toSparqlTable());
            break;
        }
        case "module": {
            this.currentTable$ = this.vdi2206Service.getModules().pipe(toSparqlTable());
            break;
        }
        case "component": {
            this.currentTable$ = this.vdi2206Service.getComponents().pipe(toSparqlTable());
            break;
        }
        default: {
            break;
        }
        }
    }

}
