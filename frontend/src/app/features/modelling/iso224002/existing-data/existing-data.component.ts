import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Observable, combineLatest, merge } from 'rxjs';
import { take } from 'rxjs/operators';
import { Iso22400_2ModelService } from '../../rdf-models/iso22400_2Model.service';
import { Vdi2206ModelService } from '../../rdf-models/vdi2206Model.service';
import { Vdi3682ModelService } from '../../rdf-models/vdi3682Model.service';
import { ListData } from '../../../../shared/modules/table/table.component';
import { toSparqlVariableList } from '../../utils/rxjs-custom-operators';

@Component({
    selector: 'app-existing-data',
    templateUrl: './existing-data.component.html',
    styleUrls: ['./existing-data.component.scss']
})
export class ExistingDataComponent implements OnInit {

    @Output("onAppTableClick") onAppTableClick = new EventEmitter<string>();

    // input variable that can be changed to trigger updates
    @Input() updateBoolean: boolean;

    // variables for app tables
    allVDIInfo: ListData[]
    allIsoEntityInfo: Array<Record<string, any>> = [];
    allIsoElementInfo: Array<Record<string, any>> = [];
    allIsoKPIInfo: Array<Record<string, any>> = [];
    // TODO: check why nothing is assigned here
    tableTitle: string;
    tableSubTitle: string;

    constructor(
    private isoService: Iso22400_2ModelService,
    private vdi2206Service: Vdi2206ModelService,
    private vdi3682Service: Vdi3682ModelService,
    ) { }

    ngOnInit(): void {
        this.getAllTableInfo();
    }

    /**
   * updates triggered by other components
   */
    ngOnChanges(changes: SimpleChanges) {
        // updates dropdowns if new triples are added
        if (changes['updateBoolean']) {
            // only update once
            if (this.updateBoolean) { this.getAllTableInfo(); }
        }
    }

    /**
   * method to get all contents in app tables from backend
   */
    getAllTableInfo(): void {
        // wrap vdi2206Service.getLIST_OF_SYSTEMS() as observable for now
        // TODO: exchange with real observable, as soon as vdi2206Service is updated
        const vdi2206Systems = this.vdi2206Service.getSystems();
        // joined tabele (vdi 2206 & 3682) TODO: replace vdi2206Observable
        combineLatest([vdi2206Systems.pipe(take(1), toSparqlVariableList('system')), this.vdi3682Service.getListOfTechnicalResources()]).subscribe(([vdi2206Systems, vdi3682Tr]) => {
            this.allVDIInfo = [
                {
                    header: "VDI2206:System",
                    entries: vdi2206Systems
                },
                {
                    header: "VDI3682:TechnicalResource",
                    entries: vdi3682Tr
                }
            ];
        });
        // }
        //     ),["VDI2206:System", "VDI3682:TechnicalResource"])
        //     .subscribe((data: Array<Record<string, string>>) => this.allVDIInfo = data);
        // remaining tables wihtout joins
        this.isoService.getTableOfAllEntityInfo().subscribe((data: Record<string, string>[]) => this.allIsoEntityInfo = data);
        this.isoService.getTableOfElements().subscribe((data: Record<string, string>[]) => this.allIsoElementInfo = data);
        this.isoService.getTableOfKPIs().subscribe((data: Record<string, string>[]) => this.allIsoKPIInfo = data);
    }

    /**
   * method to transfer content from app table to form
   */
    tableClick(entityName: string): void {
        this.onAppTableClick.emit(entityName);
    }

}
