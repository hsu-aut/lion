import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { take } from 'rxjs/operators';
import { finalize } from 'rxjs/operators';
import { concat } from "rxjs";

import { ConfigurationService } from '../../shared/services/backEnd/configuration.service';
import { RepositoryOperationsService } from '../../shared/services/backEnd/repositoryOperations.service';
import { MessagesService } from '../../shared/services/messages.service';
import { DashboardService } from '../../shared/services/dashboard.service';
import { OdpInfo, OdpName } from '@shared/models/odps/odp';
import { OdpService } from '../../shared/services/backEnd/odp.service';


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

    // ODPs
    odpInfos = new Array<OdpInfo>();
    odpFormGroup = this.fb.group({});

    // forms
    repositoryOption = this.fb.control('', Validators.required);
    repositoryCreate = this.fb.control('', Validators.required);
    repositoryClear = this.fb.control('', Validators.required);
    repositoryDelete = this.fb.control('', Validators.required);

    constructor(
        private config: ConfigurationService,
        private repositoryOperation: RepositoryOperationsService,
        private odpService: OdpService,
        private messageService: MessagesService,
        private fb: FormBuilder

    ) {
        this.activeRepository = this.config.getRepository();
    }

    ngOnInit() {
        this.odpService.getAllOdps().pipe(take(1)).subscribe(odps => {
            this.odpInfos = odps;
            odps.forEach(odp => {
                this.odpFormGroup.addControl(odp.name, new FormControl(odp.versions[0]));
            });
        });
        this.getListOfRepos();
    }


    getListOfRepos() {
        this.repositoryOperation.getListOfRepositories().pipe(take(1)).subscribe((data: any) => {
            this.repositoryList = data;
            this.repoCount = this.repositoryList.length;
        });
    }

    setRepository(repositoryName: string) {
        if (this.repositoryOption.valid) {
            this.config.setRepository(repositoryName);
            this.activeRepository = this.config.getRepository();
        } else if (this.repositoryOption.invalid) {
            this.messageService.addMessage('error', 'Ups!', 'It seems like you are missing some data here...');
        }
    }

    createRepository(repositoryName: string) {
        if (this.repositoryCreate.valid) {
            this.repositoryOperation.createRepository(repositoryName).pipe(take(1)).subscribe((data: any) => {
                this.getListOfRepos();
            });
        } else if (this.repositoryCreate.invalid) {
            this.messageService.addMessage('error', 'Ups!', 'It seems like you are missing some data here...');
        }

    }


    clearRepository(repositoryName: string) {
        if (this.repositoryClear.valid) {
            this.repositoryOperation.clearRepository(repositoryName).pipe(take(1)).subscribe((data: any) => {
            });
        } else if (this.repositoryClear.invalid) {
            this.messageService.addMessage('error', 'Ups!', 'It seems like you are missing some data here...');
        }
    }

    deleteRepository(repositoryName: string) {
        if (this.repositoryDelete.valid) {
            this.repositoryOperation.deleteRepository(repositoryName).pipe(take(1)).subscribe((data: any) => {
                this.getListOfRepos();
            });
        } else if (this.repositoryDelete.invalid) {
            this.messageService.addMessage('error', 'Ups!', 'It seems like you are missing some data here...');
        }
    }


    /**
     * Loads one ODP with its specified version
     * @param odpName Name of the ODP to load
     */
    loadOdp(odpName: OdpName): void {
        const version = this.odpFormGroup.get(odpName).value;
        this.odpService.loadOdpIntoRepository(odpName, version).pipe(take(1)).subscribe();
    }

    /**
     * Sets all ODPs to their latest version
     */
    setAllVersionsToLatest(): void {
        Object.keys(this.odpFormGroup.controls).forEach(fgKey => {
            // This assumes that latest version is always the first retrieved from Github.
            // This might not always be the case, it might be better to properly sort by tag name
            const latestVersion = this.odpInfos.find(odpInfo => odpInfo.name == fgKey).versions[0];
            this.odpFormGroup.get(fgKey).setValue(latestVersion);
        });
    }

    /**
     * Loads all ODPs with the currently specified versions
     */
    loadAllOdps(): void {
        // Iterate over the form to load every odp with the selected version
        Object.keys(this.odpFormGroup.controls).forEach(fgKey => {
            const odpName = OdpName[fgKey];
            const version = this.odpFormGroup.get(fgKey).value;
            this.odpService.loadOdpIntoRepository(odpName, version).pipe(take(1)).subscribe();
        });
    }


}
