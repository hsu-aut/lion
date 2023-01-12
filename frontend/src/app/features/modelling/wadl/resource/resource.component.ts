import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Observable, take } from "rxjs";
import { MessagesService } from "@shared-services/messages.service";
import { PrefixesService } from "@shared-services/prefixes.service";
import { WadlModelService } from "../../rdf-models/wadlModel.service";
import { toSparqlTable, toSparqlVariableList } from "../../utils/rxjs-custom-operators";
import { cValFns } from "../../utils/validators";
import { WadlResource } from "@shared/models/odps/wadl/Resource";

@Component({
    selector: 'wadl-resource',
    templateUrl: './resource.component.html',
    // styleUrls: ['../wadl.component.scss']
})
export class ResourceComponent implements OnInit {

    // Custom validator
    customVal = new cValFns();

    resourceForm = this.fb.group({
        resourceBasePath: ["", Validators.required],
        resourcePath: ["", [Validators.required, this.customVal.noProtocol, Validators.pattern('([-a-zA-Z0-9()@:%_+.~#?&//=]){1,}')]]
    })

    resourceBasePaths: Array<string> = [];
    NoOfResourceBasePaths: number;
    resourceTable: Array<Record<string, any>> = [];


    constructor(
        private fb: FormBuilder,
        private wadlService: WadlModelService,
        private messageService: MessagesService,
        private prefixService: PrefixesService
    ) {}

    ngOnInit(): void {
        this.loadResourceTable();
        this.loadBasePaths();
    }


    private loadBasePaths(): void {
        this.wadlService.getBaseResources().pipe(take(1), toSparqlVariableList("baseResource")).subscribe((data: any) => {
            this.resourceBasePaths = data;
            this.NoOfResourceBasePaths = this.resourceBasePaths.length;
        });
    }

    public tableClick(event): void {
        this.resourceForm.controls['resourceBasePath'].setValue(event.baseResource);
        this.resourceForm.controls['resourcePath'].setValue(event.resourcePath.slice(1));
    }

    addResource(): void {
        const sD = this.getResourceDefinition();
        this.wadlService.addResource(sD).pipe(take(1)).subscribe();
        this.loadResourceTable();
    }

    deleteResource(): void {
        const sD = this.getResourceDefinition();
        this.wadlService.deleteResource(sD.resourceIri).pipe(take(1)).subscribe();
        this.loadResourceTable();
    }

    getResourceInsertString(): Observable<string> {
        const sD = this.getResourceDefinition();
        return this.wadlService.getResourceInsertString(sD);
    }


    /**
     * Creates a ResourceDefinition object from the form values
     * @returns An object of the class ResourceDefinition with all the form values
     */
    getResourceDefinition(): WadlResource {
        if (this.resourceForm.invalid) {
            this.messageService.addMessage('error', 'Ups!', 'It seems like you are missing some data here...');
            throw new Error("Invalid Form");
        }

        const baseResourceIri = this.prefixService.addOrParseNamespace(this.resourceForm.controls['resourceBasePath'].value);
        const resourcePath = "/" + this.resourceForm.controls['resourcePath'].value;
        const resourceIri = baseResourceIri + resourcePath;
        return new WadlResource(baseResourceIri, resourcePath, resourceIri);
    }

    /**
     * Loads all entries of the resource table
     */
    loadResourceTable(): void {
        this.wadlService.getResources().pipe(take(1), toSparqlTable()).subscribe((data: any) => {
            this.resourceTable = data;
        });
    }

}
