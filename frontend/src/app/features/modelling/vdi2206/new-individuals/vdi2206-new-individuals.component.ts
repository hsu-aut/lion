import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Vdi2206ModelService } from '../../rdf-models/vdi2206Model.service';
import { Observable } from 'rxjs';
import { TboxService } from '../../rdf-models/tbox.service';

@Component({
    selector: 'vdi2206-new-individuals',
    templateUrl: './vdi2206-new-individuals.component.html',
    styleUrls: ['./vdi2206-new-individuals.component.scss']
})
export class Vdi2206NewIndividualsComponent implements OnInit {

    allClasses$: Observable<string[]>;

    newTripleForm = this.fb.group({
        subject: this.fb.control("", Validators.required),
        predicate: this.fb.control({value:"rdf:type", disabled: true}, Validators.required),
        object: this.fb.control("", Validators.required)
    })

    constructor(
        private fb: FormBuilder,
        private vdi2206Service: Vdi2206ModelService,
        private tboxService: TboxService
    ) { }

    ngOnInit(): void {
        this.allClasses$ = this.tboxService.getClassesWithinNamespace("http://www.hsu-ifa.de/ontologies/VDI2206#");
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
