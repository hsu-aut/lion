import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { firstValueFrom, take } from "rxjs";
import { WadlBaseResource } from "@shared/models/odps/wadl/BaseResource";
import { MessagesService } from "../../../shared/services/messages.service";
import { PrefixesService } from "../../../shared/services/prefixes.service";
import { WadlModelService } from "../../rdf-models/wadlModel.service";
import { toSparqlTable, toSparqlVariableList } from "../../utils/rxjs-custom-operators";
import { cValFns } from "../../utils/validators";
import { Vdi3682ModelService } from "../../rdf-models/vdi3682Model.service";
import { Iso22400_2ModelService } from "../../rdf-models/iso22400_2Model.service";
import { Vdi2206ModelService } from "../../rdf-models/vdi2206Model.service";
import { Tables } from "../../utils/tables";

@Component({
    selector: 'wadl-base-resource',
    templateUrl: './base-resource.component.html',
    // styleUrls: ['../wadl.component.scss']
})
export class BaseResourceComponent implements OnInit {

    // Custom validator
    customVal = new cValFns();

    // Old table util. // TODO: Change to new operator
    tableUtil = new Tables();

    baseResourcesTable: Array<Record<string, any>> = [];
    resourceBasePaths: Array<string> = [];
    NoOfResourceBasePaths: number;


    baseResourceForm = this.fb.group({
        resourceBasePath: [undefined, [Validators.required, this.customVal.noProtocol, this.customVal.isDomain]],
        serviceProvider: [undefined]
    })

    allIsoEntityInfo: Array<Record<string, any>> = [];
    allVDIInfo: Array<Record<string, any>> = [];

    constructor(
        private fb: FormBuilder,
        private prefixService: PrefixesService,
        private wadlService: WadlModelService,
        private vdi3682Service: Vdi3682ModelService,
        private vdi2206Service: Vdi2206ModelService,
        private isoService: Iso22400_2ModelService,
    ) {}

    ngOnInit(): void {
        this.getTables();
    }


    tableClick(context: string, event) {
        switch (context) {
        case "VDI": {
            this.baseResourceForm.controls['serviceProvider'].setValue(event);
            break;
        }
        case "ISO": {
            this.baseResourceForm.controls['serviceProvider'].setValue(event.Entity);
            break;
        }
        case "WADL": {
            // console.log(event.basePath.slice(7))
            this.baseResourceForm.controls['serviceProvider'].setValue(event.serviceProvider);
            this.baseResourceForm.controls['resourceBasePath'].setValue(event.basePath.slice(7));
            break;
        }
        }
    }

    addBaseResource(): void {
        if (this.baseResourceForm.invalid) {
            console.log("errors");

            this.baseResourceForm.errors;
            console.log("Form invalid");
            return;
        }
        const basePath = this.baseResourceForm.get("resourceBasePath").value;
        const baseResourcePath = "http://" + basePath;
        const baseResourceIri = this.prefixService.addOrParseNamespace(basePath);
        const serviceProviderIri = this.prefixService.addOrParseNamespace(this.baseResourceForm.get("serviceProvider").value);
        const baseResourceDefinition = new WadlBaseResource(baseResourcePath, baseResourceIri, serviceProviderIri);
        this.wadlService.createBaseResource(baseResourceDefinition).pipe(take(1)).subscribe((data: any) => {
            this.loadDynamicDropdowns();
            this.loadDynamicTables();
        });
    }

    deleteBaseResource(): void {
        if (!this.baseResourceForm.valid) {
            console.log("Form invalid");
            return;
        }

        const basePath = this.baseResourceForm.get("resourceBasePath").value;
        const baseResourceIri = this.prefixService.addOrParseNamespace(basePath);
        this.wadlService.deleteBaseResource(baseResourceIri).pipe(take(1)).subscribe((data: any) => {
            this.loadDynamicDropdowns();
            this.loadDynamicTables();
        });

    }

    getInsertString() {
        this.wadlService.getBaseResourceInsertString("asd");
    }



    loadDynamicDropdowns() {
        this.wadlService.getBaseResources().pipe(take(1), toSparqlVariableList("baseResource")).subscribe((data: any) => {
            this.resourceBasePaths = data;
            this.NoOfResourceBasePaths = this.resourceBasePaths.length;
        });
        this.wadlService.getResources().pipe(take(1), toSparqlVariableList("service")).subscribe((data: any) => {
            this.NoOfResourceBasePaths = this.resourceBasePaths.length;
        });
    }

    loadDynamicTables() {
        this.wadlService.getBaseResources().pipe(take(1), toSparqlTable()).subscribe((data: any) => {
            this.baseResourcesTable = data;
        });
    }


    async getTables(): Promise<void> {

        // This is pretty hacky. An alternative would be to get all observables into one and subscribe to the overall result for the data table
        // ------> see commented code below (solution from iso224002 component)

        // // wrap vdi2206Service.getLIST_OF_SYSTEMS() as observable for now
        // // TODO: exchange with real observable, as soon as vdi2206Service is updated
        // const vdi2206Observable: Observable<string[]> = new Observable(subscriber => {
        //     subscriber.next(this.vdi2206Service.getLIST_OF_SYSTEMS());
        //     subscriber.complete();
        // });

        // // create new observable of two observables which completes when each observable returns 1st output
        // const combinedObservable: Observable<[string[], string[]]> = forkJoin([
        //     vdi2206Observable.pipe(take(1)),    // TODO: exchange this dummy with real observable
        //     this.vdi3682Service.getListOfTechnicalResources().pipe(take(1))
        // ]);

        // // combine in one table as soon as combined observable completes
        // combinedObservable.pipe(take(1)).subscribe((data: [string[], string[]]) => {
        //     const cols: string[] = ["VDI2206:System", "VDI3682:TechnicalResource"];
        //     this.allVDIInfo = this.tableUtil.concatListsToTable(cols, data);
        // });

        const cols = ["VDI2206:System", "VDI2206:Module", "VDI3682:TechnicalResource"];
        const tr = await firstValueFrom(this.vdi3682Service.getListOfTechnicalResources());
        const data = [this.vdi2206Service.getLIST_OF_SYSTEMS(), this.vdi2206Service.getLIST_OF_MODULES(), tr];
        console.log(data);

        this.allVDIInfo = this.tableUtil.concatListsToTable(cols, data);

        //   this.allIsoEntityInfo = this.isoService.getTABLE_ALL_ENTITY_INFO();
        this.isoService.getTableOfAllEntityInfo().subscribe((data: any) => this.allIsoEntityInfo = data);

        this.wadlService.getBaseResources().pipe(take(1), toSparqlTable()).subscribe(data => this.baseResourcesTable = data);
    }

}
