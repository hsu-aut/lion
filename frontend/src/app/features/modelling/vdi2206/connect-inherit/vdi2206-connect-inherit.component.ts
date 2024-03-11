import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Vdi2206ModelService } from '../../rdf-models/vdi2206Model.service';
import { take } from 'rxjs';
import { TboxService } from '../../rdf-models/tbox.service';

@Component({
    selector: 'vdi2206-connect-inherit',
    templateUrl: './vdi2206-connect-inherit.component.html',
    styleUrls: ['./vdi2206-connect-inherit.component.scss']
})
export class Vdi2206ConnectInheritComponent implements OnInit {

    @Input() selectedSubject: string;        // selected from the table in parent component and passed to children
    @Input() selectedPredicate: string;     // selected from the table in parent component and passed to children

    existingObjects: Array<string>;
    selectedObjectClass: string;

    connectTripleForm = this.fb.group({
        selectedSubject: this.fb.control("", Validators.required),
        selectedPredicate: this.fb.control("", Validators.required),
        selectedObject: this.fb.control("", Validators.required)
    })

    constructor(
        private fb: FormBuilder,
        private vdi2206Service: Vdi2206ModelService,
        private tboxService: TboxService
    ) {}

    ngOnInit(): void {
    }

    getExistingObjects(): void  {
        const {selectedSubject, selectedPredicate} = this.connectTripleForm.value;

        if (selectedPredicate != undefined) {
            const subject = selectedSubject;
            this.tboxService.getClassOfIndividualWithinNamespace(subject, "http://www.w3id.org/hsu-aut/VDI2206#").pipe(take(1)).subscribe((data: any) => {
                const owlClass = data[0];
                this.tboxService.getListOfIndividualsByClass(owlClass, "http://www.w3id.org/hsu-aut/VDI2206#").pipe(take(1)).subscribe((data: any) => {
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
