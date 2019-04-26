import { Component, OnInit } from '@angular/core';
import { UUIDgen } from '../../utils/uuid' 

@Component({
  selector: 'app-iso22400',
  templateUrl: './iso22400.component.html',
  styleUrls: ['./iso22400.component.scss']
})
export class ISO22400Component implements OnInit {

  constructor() { }
  UUIDGenerator = new UUIDgen();
  UUID;
  ngOnInit() {
    this.UUID = this.UUIDGenerator.generateFreshIRI();
  }

}
