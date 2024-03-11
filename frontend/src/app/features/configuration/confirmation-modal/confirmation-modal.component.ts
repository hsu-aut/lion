import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Modal } from 'bootstrap';
import { RepositoryDto } from '@shared/models/repositories/RepositoryDto';

@Component({
    selector: 'app-confirmation-modal',
    templateUrl: './confirmation-modal.component.html',
    styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent {

    @Input('context') context: string;
    contextElementName: string;      // Name of the graph, repo, ... to clear or delete
    @Output("onConfirm") onConfirm = new EventEmitter<void>();
    @ViewChild('confirmModal') confirmModal: ElementRef;

    operation: string;

    constructor() { }

    showConfirmationModal(operation: string, contextElementName: string): void {
        const modal = new Modal(this.confirmModal.nativeElement);
        this.contextElementName = contextElementName;
        this.operation = operation;
        modal.show();
    }


    confirm(): void {
        this.onConfirm.emit();
    }

}
