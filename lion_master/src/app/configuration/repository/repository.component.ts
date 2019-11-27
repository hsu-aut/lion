import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { take } from 'rxjs/operators';
import { finalize } from 'rxjs/operators';
import { concat } from "rxjs";

import { ConfigurationService } from '../../shared/services/backEnd/configuration.service';
import { RepositoryOperationsService } from '../../shared/services/backEnd/repositoryOperations.service';
import { MessagesService } from '../../shared/services/messages.service';
import { Dinen61360Service } from '../../modelling/rdf-models/dinen61360Model.service';
import { Isa88ModelService } from '../../modelling/rdf-models/isa88Model.service';
import { Iso22400_2ModelService } from '../../modelling/rdf-models/iso22400_2Model.service';
import { Vdi2206ModelService } from '../../modelling/rdf-models/vdi2206Model.service';
import { Vdi3682ModelService } from '../../modelling/rdf-models/vdi3682Model.service';
import { WadlModelService } from '../../modelling/rdf-models/wadlModel.service';
import { DashboardService } from '../../shared/services/dashboard.service';


@Component({
  selector: 'app-repository',
  templateUrl: './repository.component.html',
  styleUrls: ['./repository.component.scss']
})
export class RepositoryComponent implements OnInit {

  // util variables
  keys = Object.keys;

  // stats
  repoCount: number;

  // repository config
  repositoryList: Array<string>;
  activeRepository: string;

  // forms
  repositoryOption = this.fb.control('', Validators.required);
  repositoryCreate = this.fb.control('', Validators.required);
  repositoryClear = this.fb.control('', Validators.required);
  repositoryDelete = this.fb.control('', Validators.required);

  constructor(
    private config: ConfigurationService,
    private repositoryOperation: RepositoryOperationsService,
    private messageService: MessagesService,

    // model services
    private VDI3862_Service: Vdi3682ModelService,
    private VDI2206_Service: Vdi2206ModelService,
    private ISA_Service: Isa88ModelService,
    private DINEIN61360_Service: Dinen61360Service,
    private Dashboard_Service: DashboardService,
    private WadlModelService: WadlModelService,
    private Iso22400_2ModelService: Iso22400_2ModelService,

    private fb: FormBuilder

  ) {
    this.activeRepository = this.config.getRepository();
  }

  ngOnInit() {
    this.getListOfRepos();
  }


  getListOfRepos() {
    this.repositoryOperation.getListOfRepositories().pipe(take(1)).subscribe((data: any) => {
      this.repositoryList = data;
      this.repoCount = this.repositoryList.length;
    })
  }

  setRepository(repositoryName: string) {
    if (this.repositoryOption.valid) {
      this.config.setRepository(repositoryName);
      this.activeRepository = this.config.getRepository();
      this.refreshServices();
    } else if (this.repositoryOption.invalid) {
      this.messageService.addMessage('error', 'Ups!', 'It seems like you are missing some data here...')
    }
  }

  createRepository(repositoryName: string) {
    if (this.repositoryCreate.valid) {
      this.repositoryOperation.createRepository(repositoryName).pipe(take(1)).subscribe((data: any) => {
        this.getListOfRepos();
      })
    } else if (this.repositoryCreate.invalid) {
      this.messageService.addMessage('error', 'Ups!', 'It seems like you are missing some data here...')
    }

  }


  clearRepository(repositoryName: string) {
    if (this.repositoryClear.valid) {
      this.repositoryOperation.clearRepository(repositoryName).pipe(take(1)).subscribe((data: any) => {
      })
    } else if (this.repositoryClear.invalid) {
      this.messageService.addMessage('error', 'Ups!', 'It seems like you are missing some data here...')
    }
  }

  deleteRepository(repositoryName: string) {
    if (this.repositoryDelete.valid) {
      this.repositoryOperation.deleteRepository(repositoryName).pipe(take(1)).subscribe((data: any) => {
        this.getListOfRepos();
      })
    } else if (this.repositoryDelete.invalid) {
      this.messageService.addMessage('error', 'Ups!', 'It seems like you are missing some data here...')
    }
  }


  refreshServices() {
    console.info("Refreshing data ...")
    this.VDI3862_Service.initializeVDI3682();
    this.VDI2206_Service.initializeVDI2206();
    this.ISA_Service.initializeISA88();
    this.DINEIN61360_Service.initializeDINEN61360();
    this.Dashboard_Service.initializeDashboard();
    this.WadlModelService.initializeWADL();
    this.Iso22400_2ModelService.initializeISO22400_2();
  }

  loadTBoxes() {
    var ObservableSequence = concat(
      this.repositoryOperation.loadTBoxes(this.config.getRepository(), "VDI3682"),
      this.repositoryOperation.loadTBoxes(this.config.getRepository(), "WADL"),
      this.repositoryOperation.loadTBoxes(this.config.getRepository(), "ISA88"),
      this.repositoryOperation.loadTBoxes(this.config.getRepository(), "DINEN61360"),
      this.repositoryOperation.loadTBoxes(this.config.getRepository(), "VDI2206"),
      this.repositoryOperation.loadTBoxes(this.config.getRepository(), "ISO22400_2"),

    ).pipe(
      finalize(() => this.refreshServices()) // Execute when the observable completes
    )

    ObservableSequence.subscribe((data: any) => console.log(data));
  }


}
