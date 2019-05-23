import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rdf-modelling',
  templateUrl: './rdf-modelling.component.html',
  styleUrls: ['./rdf-modelling.component.scss']
})
export class RdfModellingComponent implements OnInit {

  collapedSideBar: boolean;

  constructor() { }

  ngOnInit() {
  }

  receiveCollapsed($event) {
    this.collapedSideBar = $event;
  }
}
