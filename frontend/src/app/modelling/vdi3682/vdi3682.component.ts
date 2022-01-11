import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';

import { Vdi3682ModelService, VDI3682DATA, VDI3682VARIABLES, VDI3682INSERT } from '../rdf-models/vdi3682Model.service';
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
    modelData = new VDI3682DATA();
    modelInsert = new VDI3682INSERT();
    modelVariables = new VDI3682VARIABLES();

    // graph db data
    allProcessInfo: Array<Record<string, any>> = [];
    allClasses: Array<string> = [];
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
        this.allProcessInfo = this.modelService.getALL_PROCESS_INFO_TABLE();
        this.modelService.getListOfAllClasses().pipe(take(1)).subscribe(data => this.allClasses = data);
        this.getStatisticInfo();
    }

    handleNewTriple(action: string): void {
        if (this.newIndividualForm.valid) {

            this.modelVariables.simpleStatement = {
                subject: this.nameService.addOrParseNamespace(this.newIndividualForm.controls['name'].value),
                predicate: this.nameService.parseToIRI(this.newIndividualForm.controls['predicate'].value),
                object: this.nameService.parseToIRI(this.newIndividualForm.controls['type'].value)
            };
            this.modelService.modifyTripel(this.modelVariables.simpleStatement, action).pipe(take(1)).subscribe((data: any) => {
                this.loadingScreenService.stopLoading();
                this.loadAllProcessInfo();
                this.loadStatisticInfo();
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
                this.loadAllProcessInfo();
                this.loadStatisticInfo();
                this.modelVariables = new VDI3682VARIABLES();
            });

        } else {
            this.messageService.addMessage('error', 'Ups!', 'It seems like you are missing some data here...');
        }
    }

    iriTableClick(name: string): void {
        this.newConnectionForm.controls['subject'].setValue(name);

        this.modelService.loadLIST_OF_CLASS_MEMBERSHIP(this.newConnectionForm.controls['subject'].value).pipe(take(1)).subscribe((data: any) => {
            this.loadingScreenService.stopLoading();
            const owlClass = data[0];
            this.modelService.loadLIST_OF_PREDICATES_BY_DOMAIN(owlClass).pipe(take(1)).subscribe((data: any) => {
                this.loadingScreenService.stopLoading();
                this.existingPredicates = data;
            });
        });

    }

    getObjectClasses(predicate: string): void {
        if (!predicate) return;

        this.modelService.loadListOfClassesByRange(predicate).pipe(take(1)).subscribe(data => {
            this.loadingScreenService.stopLoading();
            this.existingObjectClasses = data;
        });
    }

    getExistingObjects(owlClass: string): void {
        if (!owlClass) return;

        this.modelService.loadLIST_OF_INDIVIDUALS_BY_CLASS(owlClass).pipe(take(1)).subscribe((data: any) => {
            this.loadingScreenService.stopLoading();
            this.existingObjects = data;
        });
    }

    loadAllProcessInfo(): void {
        this.modelService.loadALL_PROCESS_INFO_TABLE().pipe(take(1)).subscribe((data: any) => {
            this.loadingScreenService.stopLoading();
            this.allProcessInfo = data;
            this.modelService.setAllProcessInfoTable(this.allProcessInfo);
        });
    }


    getStatisticInfo(): void {
        // get stats of functions in TS
        this.modelService.getListOfProcesses().pipe(take(1)).subscribe(data => this.NoOfProcesses = data.length);
        this.modelService.getListOfInputsAndOutputs().pipe(take(1)).subscribe(data => this.NoOfInOuts = data.length);
        this.modelService.getListOfTechnicalResources().pipe(take(1)).subscribe(data => this.NoOfTechnicalResources = data.length);
    }

    loadStatisticInfo() {
        // this.modelService.loadLIST_OF_PROCESSES().pipe(take(1)).subscribe((data: any) => {
        // this.loadingScreenService.stopLoading();
        // this.NoOfProcesses = data.length;
        // this.modelService.setListOfProcesses(data);
        // });
        this.modelService.getListOfInputsAndOutputs().pipe(take(1)).subscribe((data: any) => {
            this.loadingScreenService.stopLoading();
            this.NoOfInOuts = data.length;
        });
        this.modelService.getListOfTechnicalResources().pipe(take(1)).subscribe((data: any) => {
            this.loadingScreenService.stopLoading();
            this.NoOfTechnicalResources = data.length;
        });
    }

}


