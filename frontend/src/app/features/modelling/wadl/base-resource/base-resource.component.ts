import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { firstValueFrom, take } from "rxjs";
import { WadlBaseResource } from "@shared/models/odps/wadl/BaseResource";
import { PrefixesService } from "@shared-services/prefixes.service";
import { WadlModelService } from "../../rdf-models/wadlModel.service";
import { cValFns } from "../../utils/validators";
import { Vdi3682ModelService } from "../../rdf-models/vdi3682Model.service";
import { Iso22400_2ModelService } from "../../rdf-models/iso22400_2Model.service";
import { Vdi2206ModelService } from "../../rdf-models/vdi2206Model.service";
import { ListData } from "../../../../shared/modules/table/table.component";
import { toSparqlVariableList } from "../../utils/rxjs-custom-operators";

@Component({
    selector: 'wadl-base-resource',
    templateUrl: './base-resource.component.html',
    // styleUrls: ['../wadl.component.scss']
})
export class BaseResourceComponent implements OnInit {

    // Custom validator
    customVal = new cValFns();

    baseResourcesTable: Array<Record<string, any>> = [];
    resourceBasePaths: Array<string> = [];
    NoOfResourceBasePaths: number;


    baseResourceForm = this.fb.group({
        resourceBasePath: ["", [Validators.required, this.customVal.noProtocol, this.customVal.isDomain]],
        serviceProvider: [""]
    })

    allIsoEntityInfo: Array<Record<string, any>> = [];
    allVDIInfo: ListData[];

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
        this.wadlService.getBaseResources().subscribe(baseResources => {
            this.resourceBasePaths = baseResources.map(br => br.baseResourcePath);
            this.NoOfResourceBasePaths = baseResources.length;
        });
        this.wadlService.getResources().subscribe(data => {
            this.NoOfResourceBasePaths = this.resourceBasePaths.length;
        });
    }

    loadDynamicTables() {
        this.wadlService.getBaseResources().subscribe(data => {
            this.baseResourcesTable = data;
        });
    }


    async getTables(): Promise<void> {

        // This is pretty hacky. An alternative would be to get all observables into one and subscribe to the overall result for the data table
        // ------> see commented code below (solution from iso224002 component)

        const tr = await firstValueFrom(this.vdi3682Service.getListOfTechnicalResources());
        const systems = await firstValueFrom(this.vdi2206Service.getSystems().pipe(toSparqlVariableList('system')));
        const modules= await firstValueFrom(this.vdi2206Service.getModules().pipe(toSparqlVariableList('module')));
        this.allVDIInfo = [
            {
                header: "VDI2206:System",
                entries: systems
            },
            {
                header: "VDI2206:Module",
                entries: modules
            },
            {
                header: "VDI3682:TechnicalResource",
                entries: tr
            }
        ];

        //   this.allIsoEntityInfo = this.isoService.getTABLE_ALL_ENTITY_INFO();
        this.isoService.getTableOfAllEntityInfo().subscribe((data: any) => this.allIsoEntityInfo = data);

        this.wadlService.getBaseResources().subscribe(data => this.baseResourcesTable = data);
    }

}
