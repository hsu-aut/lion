import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';

import { Vdi3682ModelService, VDI3682VARIABLES, VDI3682INSERT } from '../rdf-models/vdi3682Model.service';
import { PrefixesService } from '../../shared/services/prefixes.service';
import { cValFns } from '../utils/validators';

import { DataLoaderService } from '../../shared/services/dataLoader.service';
import { MessagesService } from '../../shared/services/messages.service';
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-vdi3682',
    templateUrl: './vdi3682.component.html',
    styleUrls: ['../../app.component.scss', './vdi3682.component.scss'],
})
export class VDI3682Component implements OnInit {
    // util variables
    readonly tableTitle = "Available Processes in Database";
    readonly tableSubTitle = "Click on a cell to to use it for further descriptions.";

    customVal = new cValFns();

    // stats
    NoOfProcesses: number;
    NoOfInOuts: number;
    NoOfTechnicalResources: number;

    // model data
    modelInsert = new VDI3682INSERT();
    modelVariables = new VDI3682VARIABLES();

    // graph db data
    allProcessInfo = new Array<Record<string, string | number>>();
    allClasses = new Array<string>();
    existingObjectClasses: Array<string> = [];
    existingPredicates: Array<string> = [];
    existingObjects: Array<string> = [];

    // forms
    newIndividualForm = this.fb.group({
        name: ["", [Validators.required, this.customVal.noProtocol, this.customVal.noSpecialCharacters, this.customVal.noIdentifier]],
        predicate: ['rdf:type'],
        type: ["", Validators.required],
    })

    newConnectionForm = this.fb.group({
        subject: ["", Validators.required],
        predicate: ["", Validators.required],
        objectClass: ["", Validators.required],
        object: ["", Validators.required],
    })

    constructor(
        private nameService: PrefixesService,
        private modelService: Vdi3682ModelService,
        private loadingScreenService: DataLoaderService,
        private messageService: MessagesService,
        private fb: FormBuilder,
    ) { }

    ngOnInit(): void {
        this.getCompleteProcessInfo();
        this.modelService.getListOfAllClasses().subscribe((data: string[]) => this.allClasses = data);
        this.getStatisticInfo();
    }

    private getCompleteProcessInfo(): void {
        this.modelService.getCompleteProcessInfo().subscribe(data => {
            this.allProcessInfo = data;
            this.loadingScreenService.stopLoading();
        });
    }


    /**
     * This method on "add" in the "create new individuals" tab
     * @param action
     */
    handleNewTriple(action: string): void {
        if (this.newIndividualForm.valid) {
            this.modelVariables.simpleStatement = {
                subject: this.nameService.addOrParseNamespace(this.newIndividualForm.controls['name'].value),
                predicate: this.nameService.parseToIRI(this.newIndividualForm.controls['predicate'].value),
                object: this.nameService.parseToIRI(this.newIndividualForm.controls['type'].value)
            };
            this.modelService.modifyTripel(this.modelVariables.simpleStatement, action).pipe(take(1)).subscribe((data: any) => {
                this.loadingScreenService.stopLoading();
                this.getCompleteProcessInfo();
                this.getStatisticInfo();
                this.modelVariables = new VDI3682VARIABLES();
            });
        }  else {
            this.messageService.addMessage('error', 'Ups!', 'It seems like you are missing some data here...');
        }
    }

    handleNewConnection(action: string): void {
        if (this.newConnectionForm.valid) {
            this.modelVariables.simpleStatement = {
                subject: this.nameService.parseToIRI(this.newConnectionForm.controls['subject'].value),
                predicate: this.nameService.parseToIRI(this.newConnectionForm.controls['predicate'].value),
                object: this.nameService.parseToIRI(this.newConnectionForm.controls['object'].value)
            };
            this.modelService.modifyTripel(this.modelVariables.simpleStatement, action).pipe(take(1)).subscribe((data: any) => {
                this.loadingScreenService.stopLoading();
                this.getCompleteProcessInfo();
                this.getStatisticInfo();
                this.modelVariables = new VDI3682VARIABLES();
            });

        } else {
            this.messageService.addMessage('error', 'Ups!', 'It seems like you are missing some data here...');
        }
    }

    async iriTableClick(name: string): Promise<void> {
        this.newConnectionForm.controls['subject'].setValue(name);

        this.loadingScreenService.stopLoading();

        this.modelService.getClassOfIndividualWithinNamespace(this.newConnectionForm.controls['subject'].value).pipe(take(1))
            .subscribe((data: any) => {
                const owlClass = data[0];
                this.modelService.getPropertiesByDomain(owlClass).pipe(take(1)).subscribe((data: any) => {
                    console.log("preds");
                    console.log(data);

                    this.loadingScreenService.stopLoading();
                    this.existingPredicates = data;
                });
            });

    }

    getObjectClasses(predicate: string): void {
        if (!predicate) return;

        this.modelService.getRangeClasses(predicate).subscribe(data => {
            console.log("Classes by range");
            console.log(data);

            this.loadingScreenService.stopLoading();
            this.existingObjectClasses = data;
        });
    }

    getExistingObjects(owlClass: string): void {
        if (!owlClass) return;

        this.modelService.getListOfIndividualsByClass(owlClass).pipe(take(1)).subscribe((data: any) => {
            this.loadingScreenService.stopLoading();
            this.existingObjects = data;
        });
    }


    getStatisticInfo(): void {
        // get stats of functions in TS
        this.modelService.getListOfProcesses().subscribe(data => this.NoOfProcesses = data.length);
        this.modelService.getListOfInputsAndOutputs().subscribe(data => this.NoOfInOuts = data.length);
        this.modelService.getListOfTechnicalResources().subscribe(data => this.NoOfTechnicalResources = data.length);
    }

}


