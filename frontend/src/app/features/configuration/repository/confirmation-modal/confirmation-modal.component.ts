import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Modal } from 'bootstrap';
import { RepositoryDto } from '@shared/models/repositories/RepositoryDto';

@Component({
    selector: 'app-confirmation-modal',
    templateUrl: './confirmation-modal.component.html',
    styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent implements OnInit, OnChanges {

  @Output("onConfirm") onConfirm = new EventEmitter<void>();
  @Input() repository: RepositoryDto;
  @Input() operation: string;
  @ViewChild('confirmModal') confirmModal: ElementRef;

  repoName: string;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
      if (changes.operation.currentValue == 'delete' || changes.operation.currentValue == 'clear') {
          const modal = new Modal(this.confirmModal.nativeElement);
          modal.show();
      }
      this.repoName = (this.repository.title) ? this.repository.title : "ERROR";
      return;
  }

  confirm(): void {
      this.onConfirm.emit();
  }

}
