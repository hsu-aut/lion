import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-exploration',
    templateUrl: './exploration.component.html',
    styleUrls: ['./exploration.component.scss']
})
export class ExplorationComponent implements OnInit {

    collapedSideBar: boolean;

    constructor() { }

    ngOnInit() {
    }


    receiveCollapsed($event) {
        this.collapedSideBar = $event;
    }

}
