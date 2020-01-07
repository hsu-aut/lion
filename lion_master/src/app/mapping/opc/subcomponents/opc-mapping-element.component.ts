import { Component, OnInit, Input } from '@angular/core';
import { stringify } from 'querystring';
import { OpcMappingService } from '../opc-mapping.service';

@Component({
  selector: 'opc-mapping-element',
  templateUrl: './opc-mapping-element.component.html',
  styleUrls: ['./../opc.component.scss']
})
export class OpcMappingElementComponent {

    _opcObject: {};
    objectKeys: string[];
    arrayProperties = new Array<string>();      // Array of properties that hold an array
    arrayElements = [];
    simpleProperties = new Array<string>();      // Array of properties that hold simple values
    checked = false;
    randId;

    constructor(private opcService: OpcMappingService) { }

    @Input() set opcObject(opcObj) {
        if(opcObj) {

            // set object and get keys
            this._opcObject = opcObj;
            this.objectKeys = Object.keys(this._opcObject);
            this.getObjectKeys();
            console.log(`id: ${this.createRandomId()}`);
            this.randId = this.createRandomId();
        }
    }

    getObjectKeys() {
        this.objectKeys.forEach(key => {
            // const currentElement = this._opcObject[key];
            if(Array.isArray(this._opcObject[key])) {
                this.arrayProperties.push(key)
                this.arrayElements.push(this._opcObject[key]);
                // move to last array pos:
            }
            else if(typeof(this._opcObject[key]) !== 'object') {
                this.simpleProperties.push(key);
            }
        });
    }


    selectElement() {
        if(this.checked) {
            console.log("adding object");
            this.opcService.addOpcNode({"id": this.randId, "node": this._opcObject});
        } else {
            console.log("removing object");
            this.opcService.removeOpcNode(this.randId);
        }

    }

    /**
     * Creates a simple random id by concatenating 2 digits of random numbers
     */
    createRandomId(): string {
        let id = "";
        for (let i = 0; i <= 6; i++) {
            id += Math.random().toString().substring(2,4);
        }
        return id;
    }
}
