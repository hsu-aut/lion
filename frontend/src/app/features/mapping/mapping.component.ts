import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-mapping',
    templateUrl: './mapping.component.html',
    styleUrls: ['./mapping.component.scss']
})
export class MappingComponent implements OnInit {

  collapedSideBar: boolean;

  constructor() { }

  ngOnInit() {
  }

  receiveCollapsed($event) {
      this.collapedSideBar = $event;
  }
}
