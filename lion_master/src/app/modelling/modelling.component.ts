import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modelling',
  templateUrl: './modelling.component.html',
  styleUrls: ['./modelling.component.scss']
})
export class ModellingComponent implements OnInit {

  collapedSideBar: boolean;

  constructor() { }

  ngOnInit() {
  }

  receiveCollapsed($event) {
    this.collapedSideBar = $event;
  }

}
