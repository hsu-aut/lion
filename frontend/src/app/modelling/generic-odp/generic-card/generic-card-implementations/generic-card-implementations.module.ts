import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateSimpleIndividualComponent } from './create-simple-individual/create-simple-individual.component';
import { CreateSimpleObjectPropertyComponent } from './create-simple-object-property/create-simple-object-property.component';
import { GenericCardImplementationsService } from './generic-card-implementations.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        CreateSimpleIndividualComponent,
        CreateSimpleObjectPropertyComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,     
    ],
    providers: [ GenericCardImplementationsService ]
})
export class GenericCardImplementationsModule { }
