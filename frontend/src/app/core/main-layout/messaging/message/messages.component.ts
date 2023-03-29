import { Component, Input } from '@angular/core';
import { Message } from '../message-container/message-container.component';

@Component({
    selector: 'message',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.scss']
})
export class MessageComponent {
    @Input() message: Message;

}
