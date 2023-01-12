import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { take } from 'rxjs/operators';

import { RepositoryOperationsService } from '@shared-services/backEnd/repositoryOperations.service';
import { MessagesService } from '@shared-services/messages.service';
import { OdpInfo, OdpName } from '@shared/models/odps/odp';
import { OdpService } from '@shared-services/backEnd/odp.service';


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
        private repoService: RepositoryOperationsService,
        private odpService: OdpService,
        private messageService: MessagesService,
        private fb: FormBuilder
    ) {}

    ngOnInit() {
        this.repoService.getWorkingRepository().pipe(take(1)).subscribe(data => this.activeRepository = data);
        this.odpService.getAllOdps().pipe(take(1)).subscribe(odps => {
            this.odpInfos = odps;
            odps.forEach(odp => {
                this.odpFormGroup.addControl(odp.name, new FormControl(odp.versions[0]));
            });
        });
        this.getListOfRepos();
    }


    getListOfRepos() {
        this.repoService.getListOfRepositories().pipe(take(1)).subscribe((data: any) => {
            this.repositoryList = data;
            this.repoCount = this.repositoryList.length;
        });
    }

    /**
     * Selects a repository to be the working repo
     * @param repositoryName Name of the repository to select
     */
    setRepository(repositoryName: string): void {
        if (this.repositoryOption.valid) {
            console.log("setting repo");
            this.repoService.setWorkingRepository(repositoryName).pipe(take(1)).subscribe();

        } else if (this.repositoryOption.invalid) {
            this.messageService.addMessage('error', 'Ups!', 'It seems like you are missing some data here...');
        }
    }

    /**
     * Creates a new repository with the given repository name
     * @param repositoryName Name of the repo to create
     */
    createRepository(repositoryName: string): void {
        if (this.repositoryCreate.valid) {
            this.repoService.createRepository(repositoryName).pipe(take(1)).subscribe((data: any) => {
                this.getListOfRepos();
            });
        } else if (this.repositoryCreate.invalid) {
            this.messageService.addMessage('error', 'Ups!', 'It seems like you are missing some data here...');
        }
    }

    /**
     * Clears a repository with a given repository name
     * @param repositoryName Name of the repository to clear
     */
    clearRepository(repositoryName: string): void {
        if (this.repositoryClear.valid) {
            this.repoService.clearRepository(repositoryName).pipe(take(1)).subscribe();
        } else if (this.repositoryClear.invalid) {
            this.messageService.addMessage('error', 'Ups!', 'It seems like you are missing some data here...');
        }
        this.repositoryClear.reset();
    }

    /**
     * Deletes a repository with a given repository name
     * @param repositoryName Name of the repository to delete
     */
    deleteRepository(repositoryName: string): void {
        if (this.repositoryDelete.valid) {
            this.repoService.deleteRepository(repositoryName).pipe(take(1)).subscribe((data: any) => {
                this.getListOfRepos();
            });
        } else if (this.repositoryDelete.invalid) {
            this.messageService.addMessage('error', 'Ups!', 'It seems like you are missing some data here...');
        }
        this.repositoryDelete.reset();
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
