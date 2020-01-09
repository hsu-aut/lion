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
    shownChildren= [];

    constructor(private opcService: OpcMappingService) { }

    // Using a setter to get changes of the input property
    @Input() set opcNode(node) {
        // set node and do initial setup
        this._opcNode = node;

        this.getObjectKeys();
        this.getAllChildren(this._opcNode);
        this.shownChildren = this.getKeysOfDirectChildren(this._opcNode);
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

    getKeysOfDirectChildren(node: {}): string[] {
        const keysOfDirectChildren = [];
        const keys = Object.keys(this._opcNode);
        keys.forEach(key => {
            if(Array.isArray(this._opcNode[key])) {
                keysOfDirectChildren.push(key);
            }
        });
        return keysOfDirectChildren;
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



    toggleChild(key: string) {
        const childIndex = this.shownChildren.indexOf(key);
        if(childIndex == -1) {
            this.shownChildren.push(key);
        } else {
            this.shownChildren.splice(childIndex, 1);
            console.log(this.shownChildren);

        }
    }

    childShown(key) {
        const childIndex = this.shownChildren.indexOf(key);
        if(childIndex == -1) {
            return false;
        } else {
            return true;
        }
    }


}




export interface OpcNode {
    mappingId: string;
}
