import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { WadlModelService } from '../rdf-models/wadlModel.service';
import { PrefixesService } from '@shared-services/prefixes.service';
import { DataLoaderService } from '@shared-services/dataLoader.service';
import { MessagesService } from '@shared-services/messages.service';
import { TboxService } from '../rdf-models/tbox.service';
import { Observable } from 'rxjs';
import { WadlBaseResource } from '@shared/models/odps/wadl/BaseResource';
import { WadlResource } from '@shared/models/odps/wadl/Resource';


@Component({
    selector: 'app-wadl',
    templateUrl: './wadl.component.html',
    styleUrls: ['../../../app.component.scss', './wadl.component.scss']
})
export class WadlComponent implements OnInit {


    // stats
    NoOfResourceBasePaths: number;
    NoOfServices: number;



    // for the stats
    baseResources$: Observable<WadlBaseResource[]>
    resources$: Observable<WadlResource[]>;

    constructor(
        private wadlService: WadlModelService,
    ) {
    }


    ngOnInit(): void {
        this.baseResources$ = this.wadlService.getBaseResources();
        this.resources$ = this.wadlService.getResources();
    }

}
