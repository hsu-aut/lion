import { Component, OnInit } from '@angular/core';
import { OpcMappingService } from './opc-mapping.service';
import { OpcNode } from './subcomponents/opc-mapping-element.component';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'app-opc',
    templateUrl: './opc.component.html',
    styleUrls: ['./opc.component.scss']
})
export class OpcComponent {

    node: OpcNode;
    opcModelString: string;
    opcModel;
    includeChildNodes: Boolean = true;
    numberOfNodes: number;
    countingDone = false;

    // TODO: SecurityPolicies and MessageSecurityMode should be loaded from Ontology or directly from node opc ua
    securityPolicies = ['None', 'Basic128', 'Basic192', 'Basic192Rsa15', 'Basic256Rsa15', 'Basic256Sha256', 'Aes128_Sha256_RsaOaep',
        'PubSub_Aes128_CTR', 'PubSub_Aes256_CTR', 'Basic128Rsa15', 'Basic256'];
    messageSecurityModes = ['None', 'Sign', 'SignAndEncrypt']


    serverInfoForm = this.fb.group({
        endpointUrl: this.fb.control('', Validators.pattern(/\w.+:(\/?\/?)[^\s]+:[0-9]{2,6}((\/)[\w-]*)*/)),
        securityPolicy: this.fb.control('', Validators.required),
        messageSecurityMode: this.fb.control('', Validators.required),
        username: this.fb.control(''),
        password: this.fb.control(''),
    })

    constructor(private opcService: OpcMappingService, private fb: FormBuilder) { }


    crawlServer() {
        console.log("crawluing");
        this.opcService.crawlServer(this.serverInfoForm.value).subscribe(nodeset => {
            this.opcModelString = JSON.stringify(nodeset);
        })
    }

    /**
     * Parses the string into JSON, counts the number of nodes and adds a mapping ID
     */
    createTree() {
        if (this.opcModelString) {
            this.opcModel = JSON.parse(this.opcModelString);
            this.numberOfNodes = 1;   //starting at 1 because we always have one root node
            this.countNodes(this.opcModel, 0);
        } else {
            this.opcModel = '';
            this.numberOfNodes = 0;
        }
    }


    /**
     * Recursively counts all the nodes
     * @param opcModel
     * @param count
     */
    countNodes(opcModel, count: number) {
        const keys = Object.keys(opcModel);
        keys.forEach(key => {
            const currentElement = opcModel[key]
            if (Array.isArray(currentElement)) {
                this.numberOfNodes += currentElement.length;
                currentElement.forEach(elem => {
                    this.countNodes(elem, currentElement.length);
                });
            }
        });
    }


    createMapping() {
        const serverInfo = this.serverInfoForm.value;
        this.opcService.createMapping(serverInfo).subscribe(data => {
            console.log(data);

        });
    }
}
