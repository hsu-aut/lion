import { Injectable } from '@angular/core';
import { Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class MessagesService {

    constructor() { }

    messages: Subject<Message> = new Subject();

    addMessage(type, head, body): void {
        const newMessage = new Message(type, head, body);
        this.messages.next(newMessage);
    }

}

class Message {
    constructor(
        public type: string,
        public head: string,
        public body: string
    ) {}
}
