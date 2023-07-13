import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Vdi2206ModelService } from '../../rdf-models/vdi2206Model.service';
import { take } from 'rxjs';
import { TboxService } from '../../rdf-models/tbox.service';

@Component({
    selector: 'vdi2206-connect-contain',
    templateUrl: './vdi2206-connect-contain.component.html',
    styleUrls: ['./vdi2206-connect-contain.component.scss']
})
export class Vdi2206ConnectContainComponent implements OnInit {

    private readonly namespace = "http://www.hsu-ifa.de/ontologies/VDI2206#";

    @Input() set selectedSubject(subject: string) {
        if(!subject) return;

        this.connectTripleForm.get('selectedSubject').setValue(subject);
        this.tboxService.getClassOfIndividualWithinNamespace(subject, "http://www.hsu-ifa.de/ontologies/VDI2206#").pipe(take(1)).subscribe((data: any) => {
            const owlClass = data[0];
            this.tboxService.getPropertiesByDomain(owlClass).pipe(take(1)).subscribe((data: any) => {
                this.existingPredicates = data;
                this.connectTripleForm.get('selectedPredicate').setValue(data[0]);
            });
        });
    }
    // @Input() selectedPredicate: string;

    existingObjectClasses: string[];
    existingObjects: string[];
    existingPredicates: string[];

    connectTripleForm = this.fb.group({
        selectedSubject: this.fb.control("", Validators.required),
        selectedPredicate: this.fb.control("", Validators.required),
        selectedObjectClass: this.fb.control("", Validators.required),
        selectedObject: this.fb.control("", Validators.required)
    })

    constructor(
        private fb: FormBuilder,
        private vdi2206Service: Vdi2206ModelService,
        private tboxService: TboxService
    ) { }

    ngOnInit(): void {
        this.connectTripleForm.get('selectedPredicate').valueChanges.subscribe(val => {
            console.log(val);
            this.getObjectClasses();
        });
        this.connectTripleForm.get('selectedObjectClass').valueChanges.subscribe(val => this.getExistingObjects());
    }

    public getObjectClasses(): void  {
        const selectedPredicate = this.connectTripleForm.get('selectedPredicate').value;
        console.log(selectedPredicate);

        if (selectedPredicate) {
            this.tboxService.getRangeClasses(selectedPredicate).pipe(take(1)).subscribe(data => {
                console.log(data);

                this.existingObjectClasses = data;
                this.connectTripleForm.get('selectedObjectClass').setValue(data[0]);
            });
        }
    }

    getExistingObjects(): void  {
        const {selectedSubject, selectedPredicate} = this.connectTripleForm.value;

        if (selectedPredicate != undefined) {
            this.tboxService.getClassOfIndividualWithinNamespace(selectedSubject, this.namespace).pipe(take(1)).subscribe((data: any) => {
                const owlClass = data[0];
                this.tboxService.getListOfIndividualsByClass(owlClass, this.namespace).pipe(take(1)).subscribe((data: any) => {
                    this.existingObjects = data;
                    this.connectTripleForm.get('selectedObject').setValue(data[0]);
                });
            });
        }
    }

    buildInsert(): void  {
        // const triples = this.getTriples(structureOption);
        // const insertString = ""; //this.vdi2206Service.buildTripel(triples);
        // const blob = new Blob([insertString], { type: 'text/plain' });
        // const name = 'insert.txt';
        // this.dlService.download(blob, name);
    }
    executeInsert(): void  {
        // const triples = this.getTriples(structureOption);
        // console.log(triples);
        // this.vdi2206Service.insertTripel(triples).subscribe((data: any) => {
        //     this.loadingScreenService.stopLoading();
        //     this.selectedPredicate = undefined;
        //     this.selectedObjectClass = undefined;
        //     this.selectedObject = undefined;
        //     this.existingObjectClasses = undefined;
        //     this.existingObjects = undefined;
        // });
    }

}
