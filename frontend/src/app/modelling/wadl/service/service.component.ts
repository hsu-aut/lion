import { AfterViewInit, Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { take } from "rxjs";
import { MessagesService } from "../../../shared/services/messages.service";
import { PrefixesService } from "../../../shared/services/prefixes.service";
import { WadlModelService } from "../../rdf-models/wadlModel.service";
import { toSparqlTable, toSparqlVariableList } from "../../utils/rxjs-custom-operators";
import { cValFns } from "../../utils/validators";
import { ServiceDefinition } from "@shared/models/odps/wadl/ServiceDefinition";

@Component({
    selector: 'wadl-service',
    templateUrl: './service.component.html',
    // styleUrls: ['../wadl.component.scss']
})
export class ServiceComponent implements OnInit {

    // Custom validator
    customVal = new cValFns();

    serviceForm = this.fb.group({
        resourceBasePath: [undefined, Validators.required],
        servicePath: [undefined, [Validators.required, this.customVal.noProtocol, Validators.pattern('([-a-zA-Z0-9()@:%_+.~#?&//=]){1,}')]]
    })

    resourceBasePaths: Array<string> = [];
    NoOfResourceBasePaths: number;
    servicesTable: Array<Record<string, any>> = [];


    constructor(
        private fb: FormBuilder,
        private wadlService: WadlModelService,
        private messageService: MessagesService,
        private prefixService: PrefixesService
    ) {}

    ngOnInit(): void {
        this.loadServiceTable();
        this.loadBasePaths();
    }


    private loadBasePaths(): void {
        this.wadlService.getBaseResources().pipe(take(1), toSparqlVariableList("baseResource")).subscribe((data: any) => {
            this.resourceBasePaths = data;
            this.NoOfResourceBasePaths = this.resourceBasePaths.length;
        });
        // TODO: Check if needed, seems useless
        // this.wadlService.getServices().pipe(take(1), toSparqlVariableList("service")).subscribe((data: any) => {
        //     this.NoOfResourceBasePaths = this.resourceBasePaths.length;
        // });
    }

    public tableClick(context: string, event) {
        switch (context) {
        case "SERVICE": {
            this.serviceForm.controls['resourceBasePath'].setValue(event.baseResource);
            this.serviceForm.controls['servicePath'].setValue(event.servicePath.slice(1));
            break;
        }
        }
    }

    addService(): void {
        const sD = this.getServiceDefinition();
        this.wadlService.addService(sD).pipe(take(1)).subscribe();
    }

    deleteService(): void {
        const sD = this.getServiceDefinition();
        this.wadlService.deleteService(sD.serviceIri).pipe(take(1)).subscribe();
    }

    getServiceInsertString(): string {
        const sD = this.getServiceDefinition();
        // this.wadlService.getServiceInsertString(sD).subscribe(data => return data)
        return "asd";
    }

    getServiceDefinition(): ServiceDefinition {
        if (this.serviceForm.invalid) {
            this.messageService.addMessage('error', 'Ups!', 'It seems like you are missing some data here...');
            throw new Error("Invalid Form");
        }

        const baseResourceIri = this.prefixService.addOrParseNamespace(this.serviceForm.controls['resourceBasePath'].value);
        const servicePath = "/" + this.serviceForm.controls['servicePath'].value;
        const serviceIri = baseResourceIri + servicePath;
        return new ServiceDefinition(baseResourceIri, servicePath, serviceIri);
    }

    loadServiceTable(): void {
        this.wadlService.getServices().pipe(take(1), toSparqlTable()).subscribe((data: any) => {
            this.servicesTable = data;
        });
    }

}
