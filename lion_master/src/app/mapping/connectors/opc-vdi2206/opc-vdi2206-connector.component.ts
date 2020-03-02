import { Component, OnInit } from '@angular/core';
import { Vdi2206ModelService } from 'src/app/modelling/rdf-models/vdi2206Model.service';
import { take } from 'rxjs/operators';
import { DataLoaderService } from 'src/app/shared/services/dataLoader.service';
import { OpcService } from './opc.service';

@Component({
    selector: 'opc-vdi2206-connector',
    templateUrl: './opc-vdi2206-connector.component.html',
    styleUrls: ['./opc-vdi2206-connector.component.scss']
})
export class OpcVDI2206ConnectorComponent implements OnInit {

    opcServers: [];
    systems: []

    constructor(
        private opcService: OpcService,
        private vdi2206Service: Vdi2206ModelService,
        private loadingScreenService: DataLoaderService) { }


    ngOnInit() {
        // Load all opc servers and systems
        this.vdi2206Service.loadLIST_OF_SYSTEMS().pipe(take(1)).subscribe((systems: []) => {
            this.loadingScreenService.stopLoading();
            this.systems = systems;
            console.log("systems");
            console.log(systems);
        });
        this.opcService.loadAllOpcUaServers().pipe(take(1)).subscribe((servers: []) => {
            console.log("servers");
            console.log(servers);

            this.opcServers = servers;
        })
    }


}
