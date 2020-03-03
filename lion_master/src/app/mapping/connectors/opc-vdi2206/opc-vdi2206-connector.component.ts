import { Component, OnInit } from '@angular/core';
import { Vdi2206ModelService } from 'src/app/modelling/rdf-models/vdi2206Model.service';
import { take } from 'rxjs/operators';
import { DataLoaderService } from 'src/app/shared/services/dataLoader.service';
import { OpcService } from './opc.service';
import { FormBuilder, Validators } from '@angular/forms';
import { QueriesService } from 'src/app/shared/services/backEnd/queries.service';

@Component({
    selector: 'opc-vdi2206-connector',
    templateUrl: './opc-vdi2206-connector.component.html',
    styleUrls: ['./opc-vdi2206-connector.component.scss']
})
export class OpcVDI2206ConnectorComponent implements OnInit {

    opcUaServers: [{}];
    systems: [];
    connectingObjectProperty = 'OpcUa:SystemHasOpcUaServer';
    opcVdiConnectionForm = this.fb.group({
        selectedSystem: this.fb.control('', Validators.required),
        connectingObjectProperty: this.fb.control({ value: this.connectingObjectProperty, disabled: true }, Validators.required),
        selectedOpcUaServer: this.fb.control('', Validators.required)
    })


    constructor(
        private opcService: OpcService,
        private vdi2206Service: Vdi2206ModelService,
        private loadingScreenService: DataLoaderService,
        private queryService: QueriesService,
        private fb: FormBuilder) { }


    ngOnInit() {
        // Load all opc servers and systems
        this.vdi2206Service.loadLIST_OF_SYSTEMS().pipe(take(1)).subscribe((systems: []) => {
            this.loadingScreenService.stopLoading();
            this.systems = systems;
        });
        this.opcService.loadAllOpcUaServers().pipe(take(1)).subscribe((servers: [{}]) => {
            this.opcUaServers = servers;
        });
    }


    /**
     * Creates a connection between a VDI 2206 System and an OPC UA Server
     */
    createConnection() {
        const formValues = this.opcVdiConnectionForm.getRawValue();

        const query = `PREFIX lf: <http://lionFacts#>
            PREFIX OpcUa: <http://www.hsu-ifa.de/ontologies/OpcUa#>
            PREFIX VDI2206: <http://www.hsu-ifa.de/ontologies/VDI2206#>
            INSERT DATA {
                ${formValues.selectedSystem} ${formValues.connectingObjectProperty} <${formValues.selectedOpcUaServer}>.
        }`

        this.queryService.SPARQL_UPDATE(query).pipe(take(1)).subscribe(res => {
            this.loadingScreenService.stopLoading();
        });
    }

}
