import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationModalComponent } from './confirmation-modal.component';

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [ConfirmationModalComponent],
    declarations: [ConfirmationModalComponent]
})
export class ConfirmationModalModule { }
