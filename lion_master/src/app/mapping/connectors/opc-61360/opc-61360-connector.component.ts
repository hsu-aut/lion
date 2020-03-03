import { Component, OnInit } from '@angular/core';
import { Vdi2206ModelService } from 'src/app/modelling/rdf-models/vdi2206Model.service';
import { take } from 'rxjs/operators';
import { DataLoaderService } from 'src/app/shared/services/dataLoader.service';
import { FormBuilder, Validators } from '@angular/forms';
import { QueriesService } from 'src/app/shared/services/backEnd/queries.service';
import { OpcService } from '../opc-vdi2206/opc.service';
import { Dinen61360Service } from 'src/app/modelling/rdf-models/dinen61360Model.service';
import { MessagesService } from 'src/app/shared/services/messages.service';

@Component({
    selector: 'opc-61360-connector',
    templateUrl: './opc-61360-connector.component.html',
    styleUrls: ['./opc-61360-connector.component.scss']
})
export class Opc61360ConnectorComponent implements OnInit {

    // table var
    instanceDescriptionTable = [{}];
    instanceDescriptionSubTitle: string = "DIN EN 61360 Instance Descriptions";
    filterOption: boolean = true;

    opcUaTable = [];
    opcUaSubtitle: string = "OPC UA Variables";

    overviewSubTitle: string = "Connected individuals";
    overviewTable = [];

    // connection form
    newIndividualForm = this.fb.group({
        subject: [undefined, Validators.required],
        predicate: ['DINEN61360:hasOntologicalValue'],
        object: [undefined, Validators.required],
    })


    opcUaNodes: [{}];
    dataElements: [];
    connectingObjectProperty = 'DINEN61360:hasOntologicalValue';
    opc61360ConnectionForm = this.fb.group({
        selectedDataElement: this.fb.control('', Validators.required),
        connectingObjectProperty: this.fb.control({ value: this.connectingObjectProperty, disabled: true }, Validators.required),
        selectedOpcUaNode: this.fb.control('', Validators.required)
    })


    constructor(
        private opcService: OpcService,
        private dinEn61360Service: Dinen61360Service,
        private loadingScreenService: DataLoaderService,
        private queryService: QueriesService,
        private messageService: MessagesService,
        private fb: FormBuilder) { }


    ngOnInit() {
        this.dinEn61360Service.loadTABLE_ALL_INSTANCE_INFO().pipe(take(1)).subscribe((data: []) => {
            this.instanceDescriptionTable = data;
            this.loadingScreenService.stopLoading();
        })

        // TODO: Should only load UAVariables -> Are currently not automatically created because of bug in node opcua
        this.opcService.loadAllOpcUaNodes().pipe(take(1)).subscribe((nodes: [{}]) => {
            this.opcUaTable = nodes;
        });

        this.opcService.loadVariableAnd61360Connections().pipe(take(1)).subscribe((data: []) => {
            this.overviewTable = data;
        })
    }

    iDTableClick(row) {
        this.newIndividualForm.controls['subject'].setValue(row.instance);
    }

    opcUaTableClick(row) {
        this.newIndividualForm.controls['object'].setValue(row.nodeIri);
    }

    modifyTripel(action: string) {
        const form = this.newIndividualForm;
        if (form.valid) {

            const instanceDescription = form.controls['subject'].value;
            const opcNode = form.controls['object'].value;

            this.opcService.createOpcDin61360Connection(instanceDescription, opcNode).pipe(take(1)).subscribe(data => {
                this.loadingScreenService.stopLoading();
            })

        } else if (form.invalid) {
            this.messageService.addMessage('error', 'Ups!', 'It seems like you are missing some data here...')
        }
    }
}
