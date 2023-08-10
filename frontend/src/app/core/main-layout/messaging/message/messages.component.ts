import { Component, Input } from '@angular/core';
import { Message } from '../message-container/message-container.component';

/**
 * This is a pretty simple component that gets passed a message object and displays it in HTML
 */
@Component({
    selector: 'message',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.scss']
})
export class MessageComponent {
    @Input() message: Message;

}
