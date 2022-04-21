import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { take } from 'rxjs';
import { MessagesService } from '../../../shared/services/messages.service';
import { PrefixesService } from '../../../shared/services/prefixes.service';
import { Triple } from '../../rdf-models/triple.service';
import { Vdi3682ModelService } from '../../rdf-models/vdi3682Model.service';
import { cValFns } from '../../utils/validators';

@Component({
    selector: 'new-vdi3682-individual',
    templateUrl: './new-vdi3682-individual.component.html',
    styleUrls: ['./new-vdi3682-individual.component.scss']
})
export class NewVdi3682IndividualComponent implements OnInit {
    @Output("onNewIndividual") onNewIndividual = new EventEmitter<string>();

    // util variables
    tableTitle = "Available Processes in Database";
    tableSubTitle = "Click on a cell to to use it for further descriptions.";

    // Custom validator
    customVal = new cValFns();

    // forms
    newIndividualForm = this.fb.group({
        name: ["", [Validators.required, this.customVal.noProtocol, this.customVal.noSpecialCharacters, this.customVal.noIdentifier]],
        predicate: ['rdf:type'],
        type: ["", Validators.required],
    })

    allProcessInfo = new Array<Record<string, string | number>>();
    allClasses = new Array<string>();

    constructor(
        private fb: FormBuilder,
        private prefixService: PrefixesService,
        private vdi3682Service: Vdi3682ModelService,
        private messageService: MessagesService
    ) { }

    ngOnInit(): void {
        this.getCompleteProcessInfo();
        this.vdi3682Service.getListOfAllClasses().subscribe((data: string[]) => this.allClasses = data);
    }


    private getCompleteProcessInfo(): void {
        this.vdi3682Service.getCompleteProcessInfo().subscribe(data => {
            this.allProcessInfo = data;
        });
    }


    /**
 * This method on "add" in the "create new individuals" tab
 * @param action
 */
    handleNewTriple(action: string): void {
        if (this.newIndividualForm.valid) {
            const subject = this.prefixService.addOrParseNamespace(this.newIndividualForm.controls['name'].value);
            const predicate = this.prefixService.parseToIRI(this.newIndividualForm.controls['predicate'].value);
            const object = this.prefixService.parseToIRI(this.newIndividualForm.controls['type'].value);
            const triple = new Triple(subject, predicate, object);
            this.vdi3682Service.modifyTripel(triple, action).pipe(take(1)).subscribe((data: any) => {
                this.getCompleteProcessInfo();
                this.onNewIndividual.emit(triple.subject);
            });
            this.newIndividualForm.reset();
        } else {
            this.messageService.addMessage('error', 'Ups!', 'It seems like you are missing some data here...');
        }
    }

}
