import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Vdi2206ModelService } from '../../rdf-models/vdi2206Model.service';
import { Observable } from 'rxjs';
import { TboxService } from '../../rdf-models/tbox.service';
import { Triple, TripleService } from '../../rdf-models/triple.service';
import { DownloadService } from '../../../../shared/services/backEnd/download.service';
import { MessagesService } from '../../../../shared/services/messages.service';

@Component({
    selector: 'vdi2206-new-individuals',
    templateUrl: './vdi2206-new-individuals.component.html',
    styleUrls: ['./vdi2206-new-individuals.component.scss']
})
export class Vdi2206NewIndividualsComponent implements OnInit {

    allClasses: string[];

    newTripleForm = this.fb.group({
        subject: this.fb.control("", Validators.required),
        predicate: this.fb.nonNullable.control({value:"rdf:type", disabled: true}, Validators.required),
        object: this.fb.control("", Validators.required)
    })

    constructor(
        private fb: FormBuilder,
        private dlService: DownloadService,
        private tboxService: TboxService,
        private tripleService: TripleService,
        private messageService: MessagesService
    ) { }

    ngOnInit(): void {
        this.tboxService.getClassesWithinNamespace("http://www.w3id.org/hsu-aut/VDI2206#").subscribe(data => {
            this.allClasses = data;
            this.newTripleForm.get('object').setValue(data[0]);
        });
    }

    buildInsert(): void  {
        if(this.newTripleForm.invalid) {
            this.messageService.warn('Ups!','It seems like you are missing some data here...');
            return;
        }

        const triple = this.newTripleForm.getRawValue();
        const insertString = this.tripleService.buildTripleInsertString(triple);

        const blob = new Blob([insertString], { type: 'text/plain' });
        const name = 'insert.ttl';
        this.dlService.download(blob, name);
    }

    executeInsert(): void  {
        if(this.newTripleForm.invalid) {
            this.messageService.warn('Ups!','It seems like you are missing some data here...');
            return;
        }
        const newTriple = this.newTripleForm.getRawValue() as Triple;
        this.tripleService.addTriple(newTriple).subscribe({
            next: () => this.newTripleForm.reset()
        });
    }

    deleteStatement(): void {
        if(this.newTripleForm.invalid) {
            this.messageService.warn('Ups!','It seems like you are missing some data here...');
            return;
        }
        const tripleToDelete = this.newTripleForm.getRawValue() as Triple;
        this.tripleService.deleteTriple(tripleToDelete).subscribe({
            next: () => this.newTripleForm.reset()
        });
    }

}
