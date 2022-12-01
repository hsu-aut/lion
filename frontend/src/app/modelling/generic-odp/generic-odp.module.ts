import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericOdpComponent } from './generic-odp.component';
import { GenericOdpRoutingModule } from './generic-odp.routing.module';
import { NewCardComponent } from './new-card/new-card.component';
import { HeaderCardComponent } from './header-card/header-card.component';
import { GenericCardComponent } from './generic-card/generic-card.component';
import { GenericCardContentDirective } from './generic-card/generic-card-content.directive';
import { GenericCardImplementationsService } from './generic-card/generic-card-implementations/generic-card-implementations.service';
import { GenericCardImplementationsModule } from './generic-card/generic-card-implementations/generic-card-implementations.module';


@NgModule({
    declarations: [
        // main component
        GenericOdpComponent,
        // supcomponents for organization
        NewCardComponent,
        HeaderCardComponent,
        // generic card components
        GenericCardComponent,
        GenericCardContentDirective
    ],
    imports: [
        // common module
        CommonModule,
        // routing module
        GenericOdpRoutingModule,
        // module for implementations 
        GenericCardImplementationsModule
    ],
    providers: [ GenericCardImplementationsService ]
})
export class GenericOdpModule { }
