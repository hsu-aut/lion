import { Component, OnInit } from '@angular/core';
import { MessagesService } from '../../../../shared/services/messages.service';

@Component({
    selector: 'message-container',
    templateUrl: './message-container.component.html',
    styleUrls: ['./message-container.component.scss']
})
export class MessageContainerComponent implements OnInit {
    messageList= new Array<Message>()

    constructor(private messageService: MessagesService ) {  }

    ngOnInit(): void {
        this.showAllMessages();
    }


    showAllMessages(): void{
        this.messageService.getAllMessages().subscribe(
            (messagelist) => this.messageList = messagelist,
            (err) => console.log(`Error during display of Message List. Error: ${err}`),
            null
        );
    }
}

export class Message{
    constructor(
        public title: string,
        public textbody: string,
        public type: MessageType,
        public iconClass?: string) {}
}

export enum MessageType {
    Success = "alert-success",
    Danger = "alert-danger",
    Warning = "alert-warning",
    Info = "alert-info"
}
