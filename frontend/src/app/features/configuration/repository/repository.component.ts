import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { take } from 'rxjs/operators';
import { RepositoryDto } from '@shared/models/repositories/RepositoryDto';
import { NewRepositoryRequestDto } from '@shared/models/repositories/NewRepositoryRequestDto';
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
    repositoryList: Array<RepositoryDto>;
    activeRepository: RepositoryDto;

    // ODPs
    odpInfos = new Array<OdpInfo>();
    odpFormGroup = this.fb.group({});

    // forms
    repositoryToChangeTo = this.fb.control(new RepositoryDto(), Validators.required);    // Selected repository in list
    newRepositoryForm = this.fb.group({
        repositoryId: this.fb.control('', Validators.required),
        repositoryName: this.fb.control('', Validators.required)
    });
    repositoryClearForm = this.fb.group({
        selectedRepository: this.fb.control(new RepositoryDto(), Validators.required),
        confirmId: this.fb.control('', Validators.required),
    })
    repositoryDeleteForm = this.fb.group({
        selectedRepository: this.fb.control(new RepositoryDto(), Validators.required),
        confirmId: this.fb.control('', Validators.required),
    })

    constructor(
        private repoService: RepositoryOperationsService,
        private odpService: OdpService,
        private messageService: MessagesService,
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        this.repoService.getWorkingRepository().pipe(take(1)).subscribe(data => {
            this.activeRepository = data;
        });
        this.odpService.getAllOdps().pipe(take(1)).subscribe(odps => {
            this.odpInfos = odps;
            odps.forEach(odp => {
                this.odpFormGroup.addControl(odp.name, new FormControl(odp.versions[0]));
            });
        });
        this.loadListOfRepos();
    }


    loadListOfRepos(): void {
        this.repoService.getListOfRepositories().pipe(take(1)).subscribe(data => {
            this.repositoryList = data;
            this.repoCount = this.repositoryList.length;
        });
    }

    /**
     * Selects a repository to be the working repo
     * @param repositoryName Name of the repository to select
     */
    setRepository(): void {
        if (this.repositoryToChangeTo.invalid) {
            this.messageService.addMessage('error', 'Ups!', 'It seems like you are missing some data here...');
            return;
        }
        console.log(this.repositoryToChangeTo);

        const repoIdToChangeTo = this.repositoryToChangeTo.value.id;
        this.repoService.setWorkingRepository(repoIdToChangeTo).pipe(take(1)).subscribe(newRepo => this.activeRepository = newRepo);
    }

    /**
     * Creates a new repository with the given repository name
     */
    createRepository(): void {
        if (this.newRepositoryForm.invalid) {
            this.messageService.addMessage('error', 'Ups!', 'It seems like you are missing some data here...');
            return;
        }
        const {repositoryId, repositoryName} = this.newRepositoryForm.value;
        const newRepositoryRequest = new NewRepositoryRequestDto(repositoryId, repositoryName);
        this.repoService.createRepository(newRepositoryRequest).pipe(take(1)).subscribe(() => {
            this.loadListOfRepos();
        });
    }

    /**
     * Clears a repository with a given repository ID
     */
    clearRepository(): void {
        if (this.repositoryClearForm.invalid) {
            this.messageService.addMessage('error', 'Ups!', 'It seems like you are missing some data here...');
            return;
        }

        const {selectedRepository, confirmId} = this.repositoryClearForm.value;

        if (selectedRepository.id != confirmId) {
            this.messageService.addMessage('error', 'Error', 'Selected repository ID and confirmed ID do not match. Repository was not cleared.');
            return;
        }

        this.repoService.clearRepository(selectedRepository.id).pipe(take(1)).subscribe();
        this.repositoryClearForm.reset();
    }

    /**
     * Deletes a repository with a given repository name
     */
    deleteRepository(): void {
        if (this.repositoryDeleteForm.invalid) {
            this.messageService.addMessage('error', 'Ups!', 'It seems like you are missing some data here...');
            return;
        }

        const {selectedRepository, confirmId} = this.repositoryDeleteForm.value;
        console.log(this.repositoryDeleteForm.value);

        if (selectedRepository.id != confirmId) {
            this.messageService.addMessage('error', 'Error', 'Selected repository ID and confirmed ID do not match. Repository was not deleted.');
            return;
        }

        this.repoService.deleteRepository(selectedRepository.id).pipe(take(1)).subscribe();
        this.repositoryDeleteForm.reset();
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
