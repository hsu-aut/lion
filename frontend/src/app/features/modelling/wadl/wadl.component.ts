import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormArray } from '@angular/forms';
import { Validators } from '@angular/forms';

import { WadlModelService, WADLVARIABLES } from '../rdf-models/wadlModel.service';
import { Iso22400_2ModelService } from '../rdf-models/iso22400_2Model.service';
import { Vdi2206ModelService } from '../rdf-models/vdi2206Model.service';
import { Vdi3682ModelService } from '../rdf-models/vdi3682Model.service';

import { PrefixesService } from '@shared-services/prefixes.service';
import { cValFns } from '../utils/validators';

import { DataLoaderService } from '@shared-services/dataLoader.service';
import { MessagesService } from '@shared-services/messages.service';
import { Tables } from '../utils/tables';
import { TboxService } from '../rdf-models/tbox.service';


@Component({
    selector: 'app-wadl',
    templateUrl: './wadl.component.html',
    styleUrls: ['../../../app.component.scss', './wadl.component.scss']
})
export class WadlComponent implements OnInit {

    // util variables
    keys = Object.keys;
    tableUtil = new Tables();

    customVal = new cValFns();

    // checkboxes and radios
    // private requestBodyRepresentationCheck;
    // private requestBodyRepresentationRadio;

    // model data
    modelVariables = new WADLVARIABLES();

    // stats
    NoOfResourceBasePaths: number;
    NoOfServices: number;


    // graph db data -> dynamic dropdowns
    // resourceBasePaths: Array<string> = [];
    // servicePaths: Array<string> = [];
    // classes: Array<string> = [];
    // individuals: Array<string> = [];

    // graph db data -> static dropdowns
    // methods: Array<string> = [];
    // parameterTypes: Array<string> = [];
    // responseCodes: Array<string> = [];
    // tboxes: Array<string> = [];

    // graph db data -> dynamic tables
    baseResourcesTable: Array<Record<string, any>> = [];

    constructor(
        private fb: FormBuilder,
        private nameService: PrefixesService,
        private tBoxService: TboxService,
        private wadlService: WadlModelService,
        private loadingScreenService: DataLoaderService,
        private messageService: MessagesService
    ) {
    }


    ngOnInit() {
        // this.requestFormParameterArray.removeAt(0);
        // this.getDropdowns();
    }


    // getExistingClasses(owlEntity) {
    //     if (owlEntity) {
    //         this.wadlService.loadLIST_ONTOLOGICAL_TYPES_BY_NAMESPACE(owlEntity).pipe(take(1)).subscribe((data: any) => {
    //             this.loadingScreenService.stopLoading();
    //             this.classes = data;
    //         });
    //     }
    // }

    // getExistingIndividuals(owlClass: string) {
    //     owlClass = this.nameService.parseToIRI(owlClass);
    //     this.tBoxService.getListOfIndividualsByClass(owlClass, "http://www.hsu-ifa.de/ontologies/WADL#").pipe(take(1))
    //         .subscribe((data: any) => {
    //             this.individuals = data;
    //         });
    // }






    // loadDynamicTables() {
    //     this.wadlService.getBaseResources().pipe(take(1), toSparqlTable()).subscribe((data: any) => {
    //         this.baseResourcesTable = data;
    //     });
    //     this.wadlService.getServices().pipe(take(1), toSparqlTable()).subscribe((data: any) => {
    //         this.servicesTable = data;
    //     });
    // }

    // getDropdowns() {
    //     this.wadlService.getBaseResources().pipe(take(1), toSparqlVariableList("baseResource")).subscribe(data => {
    //         this.resourceBasePaths = data;
    //         this.NoOfResourceBasePaths = this.resourceBasePaths.length;
    //     });
    //     this.wadlService.getServices().pipe(take(1), toSparqlVariableList("service")).subscribe(data => {
    //         this.servicePaths = data;
    //         this.NoOfServices = this.servicePaths.length;
    //     });
    //     this.wadlService.getMethods().pipe(take(1), toSparqlVariableList())
    //         .subscribe(data => this.methods = data);
    //     this.wadlService.getParameterTypes().pipe(take(1), toSparqlVariableList("parameterType"))
    //         .subscribe(data => this.parameterTypes = data);
    //     this.wadlService.getResponseCodes().pipe(take(1), toSparqlVariableList())
    //         .subscribe(data => this.responseCodes = data);
    // }
}
