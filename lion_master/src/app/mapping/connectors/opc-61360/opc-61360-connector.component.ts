import { Component, OnInit } from '@angular/core';
import { Vdi2206ModelService } from 'src/app/modelling/rdf-models/vdi2206Model.service';
import { take } from 'rxjs/operators';
import { DataLoaderService } from 'src/app/shared/services/dataLoader.service';
import { FormBuilder, Validators } from '@angular/forms';
import { QueriesService } from 'src/app/shared/services/backEnd/queries.service';
import { OpcService } from '../opc-vdi2206/opc.service';
import { Dinen61360Service } from 'src/app/modelling/rdf-models/dinen61360Model.service';

@Component({
    selector: 'opc-61360-connector',
    templateUrl: './opc-61360-connector.component.html',
    styleUrls: ['./opc-61360-connector.component.scss']
})
export class Opc61360ConnectorComponent implements OnInit {

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
        private fb: FormBuilder) { }


    ngOnInit() {
        // Load all opc servers and dataElements
        this.dinEn61360Service.loadLIST_All_DET().pipe(take(1)).subscribe((dataElements: []) => {
            this.loadingScreenService.stopLoading();
            console.log("data elements");
            console.log(dataElements);

            this.dataElements = dataElements;
        });
        this.opcService.loadAllOpcUaNodes().pipe(take(1)).subscribe((nodes: [{}]) => {
            this.opcUaNodes = nodes;
        });
    }


    /**
     * Creates a connection between a DIN EN 61360 DataElement and an OPC UA Node
     */
    createConnection() {
        const formValues = this.opc61360ConnectionForm.getRawValue();

        const query = `PREFIX lf: <http://lionFacts#>
            PREFIX OpcUa: <http://www.hsu-ifa.de/ontologies/OpcUa#>
            PREFIX VDI2206: <http://www.hsu-ifa.de/ontologies/VDI2206#>
            INSERT DATA {
                ${formValues.selectedSystem} ${formValues.connectingObjectProperty} <${formValues.selectedOpcUaServer}>.
        }`
        console.log(query);

        this.queryService.SPARQL_UPDATE(query).pipe(take(1)).subscribe(res => {
            this.loadingScreenService.stopLoading();
        });
    }

}
