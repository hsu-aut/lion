import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { DataLoaderService } from '@shared-services/dataLoader.service';
import { OpcService } from './opc.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MessagesService } from '@shared-services/messages.service';
import { Vdi2206ModelService } from '../../../modelling/rdf-models/vdi2206Model.service';

@Component({
    selector: 'opc-vdi2206-connector',
    templateUrl: './opc-vdi2206-connector.component.html',
    styleUrls: ['./opc-vdi2206-connector.component.scss']
})
export class OpcVDI2206ConnectorComponent implements OnInit {

    // table var
    systemModuleTable = [{}];
    systemModuleTableSubTitle = "VDI 2206 Systems and Components";
    filterOption = true;

    opcUaServerTable = [];
    opcUaServerSubtitle = "OPC UA Servers";

    overviewSubTitle = "Connected individuals";
    overviewTable = [];

    // connection form
    newIndividualForm = this.fb.group({
        subject: [undefined, Validators.required],
        predicate: ['OpcUa:hasOpcUaServer'],
        object: [undefined, Validators.required],
    })

    constructor(
        private opcService: OpcService,
        private vdi2206Service: Vdi2206ModelService,
        private loadingScreenService: DataLoaderService,
        private messageService: MessagesService,
        private fb: FormBuilder) { }


    ngOnInit() {
        // Load all opc servers and systems
        this.vdi2206Service.loadTABLE_OF_SYSTEMS_AND_MODULES().pipe(take(1)).subscribe(data => {
            this.systemModuleTable = data;
            this.loadingScreenService.stopLoading();
        });

        this.opcService.loadAllOpcUaServers().pipe(take(1)).subscribe((servers: [{}]) => {
            this.loadingScreenService.stopLoading();
            this.opcUaServerTable = servers;
        });

        this.loadExistingConnections();
    }


    /**
     * Gets called whenever a user clicks on the vdi 2206 system or module table
     * @param row Row inside the table
     */
    systemModuleTableClick(row) {
        this.newIndividualForm.controls['subject'].setValue(row.systemOrModule);
    }


    /**
     * Gets called whenever a user clicks on the opcUa server table
     * @param row Row inside the table
     */
    opcUaServerTableClick(row) {
        this.newIndividualForm.controls['object'].setValue(row.opcUaServer);
    }


    /**
     * Modifies a tripel according to the selections the user made
     * @param action //TODO: Currently not used...
     */
    modifyTripel(action: string, form) {
        // const form = this.newIndividualForm;
        if (form.valid) {

            const systemOrModule = form.controls['subject'].value;
            const opcUaServer = form.controls['object'].value;

            this.opcService.createOpcVdi2206Connection(systemOrModule, opcUaServer).pipe(take(1)).subscribe(data => {
                this.loadingScreenService.stopLoading();
                this.loadExistingConnections();
            });

        } else if (form.invalid) {
            this.messageService.addMessage('error', 'Ups!', 'It seems like you are missing some data here...');
        }
    }

    /**
     * Loads existing connections between VDI 2206 systems or modules and OPC UA servers
     */
    loadExistingConnections() {
        this.opcService.loadServerAndVdi2206Connections().pipe(take(1)).subscribe((data: []) => {
            this.overviewTable = data;
        });
    }

}
