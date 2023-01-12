import { Component } from '@angular/core';

@Component({
    selector: 'app-modelling',
    templateUrl: './modelling.component.html',
    styleUrls: ['./modelling.component.scss']
})
export class ModellingComponent {

    collapedSideBar: boolean;

    receiveCollapsed($event): void {
        this.collapedSideBar = $event;
    }

}
