import { Injectable } from '@angular/core';
import { GenericCardContentComponent } from '../generic-card-content.component';
import { CreateSimpleIndividualComponent } from './create-simple-individual/create-simple-individual.component';
import { CreateSimpleObjectPropertyComponent } from './create-simple-object-property/create-simple-object-property.component';
import { GenericCardConfig } from './generic-card-config.interface';

@Injectable()
export class GenericCardImplementationsService {

    // array with all component types and their names
    // TODO assure individuality of items in this array
    private namedComponentTypes: Array<{name: string, type: typeof GenericCardContentComponent}> = [
        {name: "Create New Individual", type: CreateSimpleIndividualComponent},
        {name: "Create New Object Property", type: CreateSimpleObjectPropertyComponent},
    ];
    // array with all component types names, atomatically generated  
    private componentTypeNames: Array<string>;

    constructor() {
        // extract all names into string array
        this.componentTypeNames = this.namedComponentTypes.map(componentType => componentType.name);
    }

    getComponent(config: GenericCardConfig): typeof GenericCardContentComponent {
        const namedComponentType: {name: string, type: typeof GenericCardContentComponent} = 
            this.namedComponentTypes.find(componentType => (componentType.name == config.type));
        if (namedComponentType == undefined) { 
            return undefined;
        }
        return namedComponentType.type;
    }

    getComponentTypeNames(): Array<string> {
        return this.componentTypeNames;
    }

}