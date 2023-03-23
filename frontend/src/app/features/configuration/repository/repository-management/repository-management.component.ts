import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { RepositoryDto } from '@shared/models/repositories/RepositoryDto';
import { NewRepositoryRequestDto } from '@shared/models/repositories/NewRepositoryRequestDto';
import { take } from 'rxjs';
import { MessagesService } from '../../../../shared/services/messages.service';
import { RepositoryOperationsService } from '../../../../shared/services/backEnd/repositoryOperations.service';

@Component({
    selector: 'repository-management',
    templateUrl: './repository-management.component.html',
    styleUrls: ['./repository-management.component.scss']
})
export class RepositoryManagementComponent implements OnInit {

    // util variables
    keys = Object.keys;



    // repository config
    repositoryList: Array<RepositoryDto>;
    activeRepository: RepositoryDto;


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
        private messageService: MessagesService,
        private fb: FormBuilder,
        private repoService: RepositoryOperationsService) {}

    ngOnInit() {
        this.repoService.getWorkingRepository().pipe(take(1)).subscribe(data => {
            this.activeRepository = data;
        });

        this.loadListOfRepos();
    }


    loadListOfRepos(): void {
        this.repoService.getListOfRepositories().pipe(take(1)).subscribe(data => {
            this.repositoryList = data;
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

}
