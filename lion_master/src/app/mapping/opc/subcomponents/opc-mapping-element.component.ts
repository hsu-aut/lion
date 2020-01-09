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

    _opcNode: OpcNode;                          // @Input, gets set via setter
    arrayKeys = new Array<string>();      // Array of properties that hold an array
    propertyKeys = new Array<string>();     // Array of properties that hold simple values
    checked: Boolean;                           // True if node selected for mapping
    selectChildren: Boolean;                    // Used to select a child node
    @Input() includeChildren;                   // Determines whether or not children are
    children = [];                              // List of all child node objects
    shownDirectChildren = [];                   // Keys of the direct children that are currently displayed


    constructor(private opcService: OpcMappingService) { }


    /**
     * Setter for the opc node (gets passed in from parent element) -> used with a setter to track changes
     */
    @Input() set opcNode(node) {
        this._opcNode = node;

        // do some setting up
        this.arrayKeys = this.getArrayKeys(this._opcNode);
        this.propertyKeys = this.getPropertyKeys(this._opcNode);
        this.getAllChildren(this._opcNode);
        this.shownDirectChildren = new Array(...this.arrayKeys)
    }


    /**
     * Sets this node as selected. This input makes it possible to set child elements from a parent element.
     * (Necessary if children shall be selected with their parent)
     */
    @Input() set selected(sel) {
        this.checked = sel;
        this.selectChildren = this.checked && this.includeChildren;
    }


    /**
     * Gets all keys of a node that contain properties (= JSON primitives like strings or numbers)
     * @param node Node to check
     */
    getPropertyKeys(node: {}): string[] {
        const objectKeys = Object.keys(node);
        const propertyKeys = [];
        objectKeys.forEach(key => {
            const currentElement = node[key];
            if(typeof(currentElement) !== 'object' && !Array.isArray(currentElement)) {
                propertyKeys.push(key);
            }
        });
        return propertyKeys;
    }


    /**
     * Gets all keys of a node that contain arrays
     * @param node Node to check
     */
    getArrayKeys(node: {}): string[] {
        const arrayKeys = [];
        const keys = Object.keys(node);
        keys.forEach(key => {
            if(Array.isArray(node[key])) {
                arrayKeys.push(key);
            }
        });
        return arrayKeys;
    }


    /**
     * Select a node for mapping. Get called on every change of the checkbox
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

        // select / deselect children
        this.selectChildren = this.checked && this.includeChildren;
    }

    /**
     * Returns the keys of all direct children (i.e. all keys of this object that hold an array)
     * @param node OPC node to get direct children keys from
     */
    getKeysOfDirectChildren(node: {}): string[] {
        const keysOfDirectChildren = [];
        const keys = Object.keys(node);
        keys.forEach(key => {
            if(Array.isArray(node[key])) {
                keysOfDirectChildren.push(key);
            }
        });
        return keysOfDirectChildren;
    }


    /**
     * Returns all children (node objects) of this node by traversion the whole tree recursively
     * @param node OPC node to get all children from
     */
    getAllChildren(node) {
        const childKeys = this.getArrayKeys(node)
        childKeys.forEach(key => {
            const currentProperty = node[key]
            currentProperty.forEach(child => {
                this.children.push(child)
                this.getAllChildren(child)
            });
        });
    }

    /**
     * Toggles the visibility of child nodes of a certain type (e.g. "organizes")
     * @param key Key of the child
     */
    toggleChild(key: string) {
        const childIndex = this.shownDirectChildren.indexOf(key);
        if(childIndex == -1) {
            this.shownDirectChildren.push(key);
        } else {
            this.shownDirectChildren.splice(childIndex, 1);
            console.log(this.shownDirectChildren);

        }
    }


    /**
     * Checks whether or not a child shall be displayed
     * @param key Key of the child to check for (e.g. "organizes")
     */
    childShown(key) {
        const childIndex = this.shownDirectChildren.indexOf(key);
        if(childIndex == -1) {
            return false;
        } else {
            return true;
        }
    }
}


/**
 * Simple interface of a node. We dont know which properties are present,
 * but for this mapping component to work, there has to be a mappingId
 */
export interface OpcNode {
    mappingId: string;
}
