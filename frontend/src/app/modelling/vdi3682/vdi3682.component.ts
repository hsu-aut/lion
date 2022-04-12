import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { Vdi3682ModelService} from '../rdf-models/vdi3682Model.service';
import { PrefixesService } from '../../shared/services/prefixes.service';

import { DataLoaderService } from '../../shared/services/dataLoader.service';
import { MessagesService } from '../../shared/services/messages.service';

@Component({
    selector: 'vdi3682',
    templateUrl: './vdi3682.component.html',
    styleUrls: ['../../app.component.scss', './vdi3682.component.scss'],
})
export class Vdi3682Component implements OnInit {

    // stats
    NoOfProcesses: number;
    NoOfInOuts: number;
    NoOfTechnicalResources: number;

    constructor(
        private nameService: PrefixesService,
        private vdi3682Service: Vdi3682ModelService,
        private loadingScreenService: DataLoaderService,
        private messageService: MessagesService,
        private fb: FormBuilder,
    ) { }

    ngOnInit(): void {
        this.getStatisticInfo();
    }


    /**
     * Event handler for the "onNewIndividual" event emitted by the sub component
     * @param newIndividualIri
     */
    handleNewIndividual(newIndividualIri: string):void {
        this.getStatisticInfo();
    }


    getStatisticInfo(): void {
        // get stats of functions in TS
        this.vdi3682Service.getListOfProcesses().subscribe(data => this.NoOfProcesses = data.length);
        this.vdi3682Service.getListOfInputsAndOutputs().subscribe(data => this.NoOfInOuts = data.length);
        this.vdi3682Service.getListOfTechnicalResources().subscribe(data => this.NoOfTechnicalResources = data.length);
    }


}


