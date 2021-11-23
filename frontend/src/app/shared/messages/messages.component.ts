import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormArray } from '@angular/forms';
import { Subscription } from "rxjs";

import { MessagesService } from '../services/messages.service';
import { getRandomString } from 'selenium-webdriver/safari';

@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, OnDestroy {
  // util variables
  keys = Object.keys;

  // forms
  messageForm = this.fb.group({
      successFormArray: this.fb.array([
          this.fb.control('')
      ]),
      warningFormArray: this.fb.array([
          this.fb.control('')
      ]),
      errorFormArray: this.fb.array([
          this.fb.control('')
      ])
  })

  // form array utils
  get successFormArray() {
      return this.messageForm.get('successFormArray') as FormArray;
  }
  setSuccessFormArray(head, body) {
      this.successFormArray.push(this.fb.group({
          head: head,
          body: body
      }));
      setTimeout(() => {this.removeMessage('success',0);}, 5000);
  }
  get warningFormArray() {
      return this.messageForm.get('warningFormArray') as FormArray;
  }
  setWarningFormArray(head, body) {
      this.warningFormArray.push(this.fb.group({
          head: head,
          body: body
      }));
      setTimeout(() => {this.removeMessage('warning',0);}, 5000);
  }
  get errorFormArray() {
      return this.messageForm.get('errorFormArray') as FormArray;
  }
  setErrorFormArray(head, body) {
      this.errorFormArray.push(this.fb.group({
          head: head,
          body: body
      }));
      setTimeout(() => {this.removeMessage('error',0);}, 5000);
  }

  messageSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private messageService: MessagesService
  ) { }

  ngOnInit() {
      this.successFormArray.removeAt(0);
      this.warningFormArray.removeAt(0);
      this.errorFormArray.removeAt(0);
      this.messageSubscription = this.messageService.messages.pipe().subscribe((messageObject) => {
      // do some message stuff
          switch (messageObject['type']) {
          case "success": {
              this.setSuccessFormArray(messageObject['head'], messageObject['body']);
              break;
          }
          case "warning": {
              this.setWarningFormArray(messageObject['head'], messageObject['body']);
              break;
          }
          case "error": {
              this.setErrorFormArray(messageObject['head'], messageObject['body']);
              break;
          }
          }
      });
  }

  ngOnDestroy() {
      this.messageSubscription.unsubscribe();
  }

  removeMessage(type, index) {
      switch (type) {
      case "success": {
          this.successFormArray.removeAt(index);
          break;
      }
      case "warning": {
          this.warningFormArray.removeAt(index);
          break;
      }
      case "error": {
          this.errorFormArray.removeAt(index);
          break;
      }
      }
  }
}
