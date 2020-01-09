import { Component, OnInit, Input } from '@angular/core';
import { stringify } from 'querystring';
import { OpcMappingService } from '../opc-mapping.service';
import { find } from 'rxjs/operators';

@Component({
  selector: 'opc-mapping-element',
  templateUrl: './opc-mapping-element.component.html',
  styleUrls: ['./../opc.component.scss']
})
export class OpcMappingElementComponent {

    _opcNode: OpcNode;                             // @Input, gets set via setter
    arrayProperties = new Array<string>();      // Array of properties that hold an array
    simpleProperties = new Array<string>();     // Array of properties that hold simple values
    checked: Boolean;                            // True if node selected for mapping
    selectChildren;
    @Input() includeChildren;
    deselectChild;
    children = [];
    showChildren: Boolean = true;

    constructor(private opcService: OpcMappingService) { }

    // Using a setter to get changes of the input property
    @Input() set opcNode(node) {
        // if(node) {
            this._opcNode = node;
        // }
        // split object keys into array and normal properties

        this.getObjectKeys();
        this.getAllChildren(this._opcNode);
    }

    /**
     * @selected allows for selecting a node from a parent node. This is used for selecting all children if includeChildren = true
     */
    @Input() set selected(sel) {
        this.checked = sel;
        this.selectChildren = this.checked && this.includeChildren;
        // if(sel) {
        //     this.opcService.addOpcNode(this._opcNode);
        //     if(this.includeChildren) {
        //         this.opcService.addAllChildren(this._opcNode);
        //     }
        // } else {
        //     this.opcService.removeOpcNode(this._opcNode);
        //     if(this.includeChildren) {
        //         this.opcService.removeAllChildren(this._opcNode)
        //     }
        // }
    }



    /**
     * Split all keys of _opcObject into keys of array properties and keys of simple properties (JSON primitives)
     */
    getObjectKeys() {
        const objectKeys = Object.keys(this._opcNode);
        objectKeys.forEach(key => {
            const currentElement = this._opcNode[key];
            if(Array.isArray(currentElement)) {
                this.arrayProperties.push(key);
            }
            else if(typeof(currentElement) !== 'object') {
                this.simpleProperties.push(key);
            }
        });
    }

    /**
     * Select a node for mapping
     */
    selectNode() {
        if(this.checked) {
            this.opcService.addOpcNode(this._opcNode);
            if(this.includeChildren) {
                this.opcService.addAllChildren(this._opcNode);
            }
        } else {
            this.opcService.removeOpcNode(this._opcNode);
            if(this.includeChildren) {
                this.opcService.removeAllChildren(this._opcNode)
            }
        }

        // select children
        this.selectChildren = this.checked && this.includeChildren;
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

    getAllChildren(node) {
        const keys = Object.keys(node);
        keys.forEach(key => {
            const currentProperty = node[key]
            if(Array.isArray(currentProperty)) {
                currentProperty.forEach(child => {
                    this.children.push(child)
                    this.getAllChildren(child)
                });
            }
        });
    }

    toggleChildren() {
        this.showChildren = !this.showChildren;
    }


}




export interface OpcNode {
    mappingId: string;
}
