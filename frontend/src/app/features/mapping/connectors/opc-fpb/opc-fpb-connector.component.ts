import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { DataLoaderService } from '@shared-services/dataLoader.service';
import { OpcService } from '../opc.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MessagesService } from '@shared-services/messages.service';
import { Vdi3682ModelService } from '../../../modelling/rdf-models/vdi3682Model.service';

@Component({
    selector: 'opc-fpb-connector',
    templateUrl: './opc-fpb-connector.component.html',
    styleUrls: ['./opc-fpb-connector.component.scss']
})
export class OpcFpdConnectorComponent implements OnInit {

    // table var
    processTable = [{}];
    processTableSubTitle = "VDI 3682 Processes";
    filterOption = true;

    opcUaNodeTable = [];
    opcUaNodeSubtitle = "OPC UA Nodes";

    overviewSubTitle = "Connected individuals";
    overviewTable = [];

    // connection form
    newIndividualForm = this.fb.group({
        subject: ["", Validators.required],
        predicate: ['OpcUa:isExecutableVia'],
        object: ["", Validators.required],
    })

    constructor(
        private opcService: OpcService,
        private fpdService: Vdi3682ModelService,
        private loadingScreenService: DataLoaderService,
        private messageService: MessagesService,
        private fb: FormBuilder) { }


    ngOnInit() {
        // Load all processes
        this.fpdService.getCompleteProcessInfo().pipe(take(1)).subscribe((data: []) => {
            this.processTable = data;
            this.loadingScreenService.stopLoading();
        });

        // TODO: Should better load just the methods and variables here...
        this.opcService.loadAllOpcUaNodes().pipe(take(1)).subscribe((nodes: [{}]) => {
            this.loadingScreenService.stopLoading();
            this.opcUaNodeTable = nodes;
        });

        this.loadExistingConnections();
    }


    /**
     * Gets called whenever a user clicks on the vdi 2206 system or module table
     * @param row Row inside the table
     */
    processTableClick(row) {
        this.newIndividualForm.controls['subject'].setValue(row.Process);
    }


    /**
     * Gets called whenever a user clicks on the opcUa server table
     * @param row Row inside the table
     */
    opcUaNodeTableClick(row) {
        this.newIndividualForm.controls['object'].setValue(row.nodeIri);
    }


    /**
     * Modifies a tripel according to the selections the user made
     * @param action //TODO: Currently not used...
     */
    modifyTripel(action: string) {
        const form = this.newIndividualForm;
        if (form.valid) {

            const process = form.controls['subject'].value;
            const opcUaNode = form.controls['object'].value;

            // TODO: A lot wrong here that needs to be fixed in one session
            // this.opcService.createNodeAndProecssConnection(process, opcUaNode).pipe(take(1)).subscribe(data => {
            //     this.loadingScreenService.stopLoading();
            //     this.loadExistingConnections();
            // });

        } else if (form.invalid) {
            this.messageService.warn('Ups!','It seems like you are missing some data here...')
        }
    }

    /**
     * Loads existing connections between VDI 2206 systems or modules and OPC UA servers
     */
    loadExistingConnections() {
        this.opcService.loadNodeAndProcessConnections().pipe(take(1)).subscribe((data: []) => {
            this.overviewTable = data;
        });
    }

}
