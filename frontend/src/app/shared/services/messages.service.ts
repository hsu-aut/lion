import { Injectable } from '@angular/core';
import { Subject } from "rxjs";
import { Message, MessageType } from '../../core/main-layout/messaging/message-container/message-container.component';

@Injectable({
    providedIn: 'root'
})
export class MessagesService {

    constructor() { }

    messageDisplay = new Array<Message>();
    $messages: Subject<Array<Message>> = new Subject();


    public getAllMessages(): Subject<Array<Message>> {
        return this.$messages;
    }


    /**
     * Adds a generic new message. Note that this should only be used for custom messages. For default cases see easier methods @see {@link success()},
     * @see {@link info()}, @see {@link warn()} and @see {@link danger()}
     * @param title Short title of the message used as heading
     * @param body Text body of the message
     * @param type Type of the message. Must be one of the given {@link MessageType}s
     */
    addMessage(title: string, body: string, type: MessageType): void {
        const newMessage = new Message(title, body, type);
        this.addAndDeleteMessage(newMessage);
    }


    /**
     * Displays a new success message
     * @param messageTitle Title of the message
     * @param messageBody Body of the message
     */
    public success(messageTitle: string, messageBody: string): void {
        const message = new Message(messageTitle, messageBody, MessageType.Success, "fa-solid fa-circle-check");
        this.addAndDeleteMessage(message);
    }


    /**
 * Displays a new info message
 * @param messageTitle Title of the message
 * @param messageBody Body of the message
 */
    public info(messageTitle: string, messageBody: string): void {
        const message = new Message(messageTitle, messageBody, MessageType.Info, "fa-solid fa-circle-info");
        this.addAndDeleteMessage(message);
    }


    /**
 * Displays a new danger message
 * @param messageTitle Title of the message
 * @param messageBody Body of the message
 */
    public danger(messageTitle: string, messageBody: string): void {
        const message = new Message(messageTitle, messageBody, MessageType.Danger, "fa-solid fa-circle-exclamation");
        this.addAndDeleteMessage(message);
    }


    /**
     * Displays a new warning message
     * @param messageTitle Title of the message
     * @param messageBody Body of the message
     */
    public warn(messageTitle: string, messageBody: string): void {
        const message = new Message(messageTitle, messageBody, MessageType.Warning, "fa-solid fa-circle-exclamation");
        this.addAndDeleteMessage(message);
    }


    private addAndDeleteMessage(message: Message): void{
        // Add a new message to the list and emit to observer
        this.messageDisplay.push(message);
        this.$messages.next(this.messageDisplay);

        // Wait 2 seconsd and remove it from the list
        setTimeout(() => {
            this.messageDisplay.splice(0,1);
            this.$messages.next(this.messageDisplay);
        },2000);
    }

}
