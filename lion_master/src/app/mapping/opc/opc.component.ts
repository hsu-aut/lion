import { Component, OnInit } from '@angular/core';
import { OpcMappingService } from './opc-mapping.service';
import { OpcNode } from './subcomponents/opc-mapping-element.component';

@Component({
  selector: 'app-opc',
  templateUrl: './opc.component.html',
  styleUrls: ['./opc.component.scss']
})
export class OpcComponent {

    node: OpcNode;
    opcModelString: string;
    opcModel;
    includeChildNodes: Boolean = false;
    numberOfNodes: number = 1;  //starting at 1 because we always have one root node
    countingDone = false;

  constructor(private opcService: OpcMappingService) { }


  createTree() {
      if (this.opcModelString.length > 0) {
        this.opcModel = JSON.parse(this.opcModelString);
        this.opcModel["mappingId"] = this.createRandomId();
        this.countNodes(this.opcModel, 0);
        this.countingDone = true;
      }
  }


  countNodes(opcModel, count:number) {
    const keys = Object.keys(opcModel);
    keys.forEach(key => {
        const currentElement = opcModel[key]
        if (Array.isArray(currentElement)) {
            this.numberOfNodes += currentElement.length;
            currentElement.forEach(elem => {
                elem["mappingId"] = this.createRandomId();
                this.countNodes(elem, currentElement.length);
            });
        }
    });
  }

  getSelection() {
      this.opcService.getSelection();
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
