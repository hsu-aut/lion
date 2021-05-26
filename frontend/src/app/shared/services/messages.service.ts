import { Injectable } from '@angular/core';
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

constructor() { }

messages: Subject<object> = new Subject();

addMessage(type, head, body){
  let newMessage = {
    type: type,
    head: head,
    body: body
  }
  this.messages.next(newMessage);
}

}
