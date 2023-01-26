import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { DataLoaderService } from '@shared-services/dataLoader.service';
import { FormBuilder, Validators } from '@angular/forms';
import { QueriesService } from '@shared-services/backEnd/queries.service';
import { OpcService } from '../opc-vdi2206/opc.service';
import { Dinen61360Service } from '../../../modelling/rdf-models/dinen61360Model.service';
import { MessagesService } from '@shared-services/messages.service';

@Component({
    selector: 'opc-61360-connector',
    templateUrl: './opc-61360-connector.component.html',
    styleUrls: ['./opc-61360-connector.component.scss']
})
export class Opc61360ConnectorComponent implements OnInit {

    // table var
    instanceDescriptionTable = [{}];
    instanceDescriptionSubTitle = "DIN EN 61360 Instance Descriptions";
    filterOption = true;

    opcUaTable = [];
    opcUaSubtitle = "OPC UA Variables";

    overviewSubTitle = "Connected individuals";
    overviewTable = [];

    // connection form
    newIndividualForm = this.fb.group({
        subject: [undefined, Validators.required],
        predicate: ['DINEN61360:hasOntologicalValue'],
        object: [undefined, Validators.required],
    })


    constructor(
        private opcService: OpcService,
        private dinEn61360Service: Dinen61360Service,
        private loadingScreenService: DataLoaderService,
        private messageService: MessagesService,
        private fb: FormBuilder) { }


    ngOnInit() {

        // exchanged with new method which fires request to backend:
        this.dinEn61360Service.getTableOfAllInstanceInfo().pipe(take(1)).subscribe((data: any) => this.instanceDescriptionTable  =  data);
        // old code
        // this.dinEn61360Service.loadTABLE_ALL_INSTANCE_INFO().pipe(take(1)).subscribe((data: []) => {
        //     this.instanceDescriptionTable = data;
        //     this.loadingScreenService.stopLoading();
        // })

        // TODO: Should only load UAVariables -> Are currently not automatically created because of bug in node opcua
        this.opcService.loadAllOpcUaNodes().pipe(take(1)).subscribe((nodes: [{}]) => {
            this.opcUaTable = nodes;
        });

        this.loadExistingConnections();
    }

    /**
     * Gets called whenever a user clicks on the instance description table
     * @param row Row inside the table
     */
    iDTableClick(row) {
        this.newIndividualForm.controls['subject'].setValue(row.instance);
    }


    /**
     * Gets called whenever a user clicks on the opcUa table
     * @param row Row inside the table
     */
    opcUaTableClick(row) {
        this.newIndividualForm.controls['object'].setValue(row.nodeIri);
    }


    /**
     * Modifies a tripel according to the selections the user made
     * @param action //TODO: Currently not used...
     */
    modifyTripel(action: string, form) {
        // const form = this.newIndividualForm;
        if (form.valid) {

            const instanceDescription = form.controls['subject'].value;
            const opcNode = form.controls['object'].value;

            this.opcService.createOpcDin61360Connection(instanceDescription, opcNode).pipe(take(1)).subscribe(data => {
                this.loadingScreenService.stopLoading();

                // After adding, refresh existing connections
                this.loadExistingConnections();
            });

        } else if (form.invalid) {
            this.messageService.addMessage('error', 'Ups!', 'It seems like you are missing some data here...');
        }
    }


    /**
     * Loads existing connections between DIN EN 61360 Instance Descriptions and OPC UA
     */
    loadExistingConnections() {
        this.opcService.loadVariableAnd61360Connections().pipe(take(1)).subscribe((data: []) => {
            this.overviewTable = data;
        });
    }
}
