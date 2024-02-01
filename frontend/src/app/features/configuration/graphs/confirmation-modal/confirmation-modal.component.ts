import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Modal } from 'bootstrap';

@Component({
    selector: 'app-confirmation-modal',
    templateUrl: './confirmation-modal.component.html',
    styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent implements OnInit, OnChanges {

  @Output("onConfirm") onConfirm = new EventEmitter<void>();
  @Input() graph: string;
  @Input() operation: string;
  @ViewChild('confirmModal') confirmModal: ElementRef;

  constructor() { }

  ngOnInit(): void {
      return;
  }

  ngOnChanges(changes: SimpleChanges): void {
      if (changes.operation.currentValue == 'delete' || changes.operation.currentValue == 'clear') {
          const modal = new Modal(this.confirmModal.nativeElement);
          modal.show();
      }
      return;
  }

  confirm(): void {
      this.onConfirm.emit();
  }

}
