import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { take } from 'rxjs';
import { MessagesService } from '@shared-services/messages.service';
import { PrefixesService } from '@shared-services/prefixes.service';
import { TboxService } from '../../rdf-models/tbox.service';
import { Triple } from '../../rdf-models/triple.service';
import { Vdi3682ModelService } from '../../rdf-models/vdi3682Model.service';

@Component({
    selector: 'vdi3682-connection',
    templateUrl: './vdi3682-connection.component.html',
    styleUrls: ['./vdi3682-connection.component.scss']
})
export class Vdi3682ConnectionComponent implements OnInit {

    // util variables
    tableTitle = "Available Processes in Database";
    tableSubTitle = "Click on a cell to to use it for further descriptions.";

    newConnectionForm = this.fb.group({
        subject: ["", Validators.required],
        predicate: ["", Validators.required],
        objectClass: ["", Validators.required],
        object: ["", Validators.required],
    })

    allProcessInfo = new Array<Record<string, string | number>>();

    existingObjectClasses: Array<string> = [];
    existingPredicates: Array<string> = [];
    existingObjects: Array<string> = [];

    constructor(
        private fb: FormBuilder,
        private tBoxService: TboxService,
        private vdi3682Service: Vdi3682ModelService,
        private prefixService: PrefixesService,
        private messageService: MessagesService
    ) { }

    ngOnInit() {
        this.vdi3682Service.getCompleteProcessInfo().subscribe(data => {
            this.allProcessInfo = data;
        });
    }

    handleNewConnection(action: string): void {
        if (this.newConnectionForm.valid) {
            const subject = this.prefixService.parseToIRI(this.newConnectionForm.controls['subject'].value);
            const predicate = this.prefixService.parseToIRI(this.newConnectionForm.controls['predicate'].value);
            const object = this.prefixService.parseToIRI(this.newConnectionForm.controls['object'].value);
            const triple = new Triple(subject, predicate, object);
            this.vdi3682Service.modifyTripel(triple, action).pipe(take(1)).subscribe((data: any) => {
                this.vdi3682Service.getCompleteProcessInfo().subscribe(data => {
                    this.allProcessInfo = data;
                });
            });

        } else {
            this.messageService.warn('Ups!','It seems like you are missing some data here...');
        }
    }


    getObjectClasses(predicate: string): void {
        if (!predicate) return;

        this.tBoxService.getRangeClasses(predicate).subscribe(data => {
            this.existingObjectClasses = data;
        });
    }

    getExistingObjects(owlClass: string): void {
        if (!owlClass) return;

        this.tBoxService.getListOfIndividualsByClass(owlClass, "http://www.w3id.org/hsu-aut/VDI3682#").pipe(take(1))
            .subscribe((data: any) => {
                this.existingObjects = data;
            });
    }


    iriTableClick(name: string): void {
        this.newConnectionForm.reset();
        this.newConnectionForm.controls['subject'].setValue(name);

        const individual = this.newConnectionForm.controls['subject'].value;
        const namespace = "http://www.w3id.org/hsu-aut/VDI3682#";
        this.tBoxService.getClassOfIndividualWithinNamespace(individual, namespace).pipe(take(1))
            .subscribe((data: any) => {
                const owlClass = data[0];
                this.tBoxService.getPropertiesByDomain(owlClass).pipe(take(1)).subscribe((data: any) => {
                    this.existingPredicates = data;
                });
            });
    }
}
