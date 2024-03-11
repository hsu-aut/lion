import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Vdi2206ModelService } from '../../rdf-models/vdi2206Model.service';
import { take } from 'rxjs';
import { TboxService } from '../../rdf-models/tbox.service';
import { TripleService } from '../../rdf-models/triple.service';
import { DownloadService } from '../../../../shared/services/backEnd/download.service';

@Component({
    selector: 'vdi2206-connect-contain',
    templateUrl: './vdi2206-connect-contain.component.html',
    styleUrls: ['./vdi2206-connect-contain.component.scss']
})
export class Vdi2206ConnectContainComponent implements OnInit {

    private readonly namespace = "http://www.w3id.org/hsu-aut/VDI2206#";

    /**
     * subject is an input that is retrieved by clicking on the table
     */
    @Input() set subject(subject: string) {
        if(!subject) return;

        this.connectTripleForm.get('subject').setValue(subject);
        this.tboxService.getClassOfIndividualWithinNamespace(subject, "http://www.w3id.org/hsu-aut/VDI2206#").pipe(take(1)).subscribe((data: any) => {
            const owlClass = data[0];
            this.tboxService.getPropertiesByDomain(owlClass).pipe(take(1)).subscribe((data: any) => {
                this.existingPredicates = data;
                this.connectTripleForm.get('predicate').setValue(data[0]);
            });
        });
    }

    existingObjectClasses: string[];
    existingObjects: string[];
    existingPredicates: string[];

    connectTripleForm = this.fb.group({
        subject: this.fb.control("", Validators.required),
        predicate: this.fb.control("", Validators.required),
        objectClass: this.fb.control("", Validators.required),
        object: this.fb.control("", Validators.required)
    })

    constructor(
        private fb: FormBuilder,
        private dlService: DownloadService,
        private tboxService: TboxService,
        private tripleService: TripleService
    ) { }

    ngOnInit(): void {
        this.connectTripleForm.get('predicate').valueChanges.subscribe(val => this.getObjectClasses());
        this.connectTripleForm.get('objectClass').valueChanges.subscribe(val => this.getExistingObjects());
    }

    getObjectClasses(): void  {
        const predicate = this.connectTripleForm.get('predicate').value;
        if (!predicate) return;

        this.tboxService.getRangeClasses(predicate).pipe(take(1)).subscribe(data => {
            console.log(data);

            this.existingObjectClasses = data;
            this.connectTripleForm.get('objectClass').setValue(data[0]);
        });
    }

    getExistingObjects(): void  {
        const {objectClass} = this.connectTripleForm.getRawValue();
        if (!objectClass) return;

        this.tboxService.getListOfIndividualsByClass(objectClass, this.namespace).pipe(take(1)).subscribe((data: any) => {
            this.existingObjects = data;
            this.connectTripleForm.get('object').setValue(data[0]);
        });
    }

    buildInsert(): void  {
        if(this.connectTripleForm.invalid) return;

        const triple = this.connectTripleForm.getRawValue();
        const insertString = this.tripleService.buildTripleInsertString(triple);

        const blob = new Blob([insertString], { type: 'text/plain' });
        const name = 'insert.ttl';
        this.dlService.download(blob, name);
    }


    executeInsert(): void  {
        if(this.connectTripleForm.invalid) return;

        const triple = this.connectTripleForm.getRawValue();

        this.tripleService.addTriple(triple).subscribe({
            next: () => this.connectTripleForm.reset()
        });
    }

}
