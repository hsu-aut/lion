import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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

    // for confirmation modal
    repoToConfirm: RepositoryDto = null;
    operationToConfirm: string;

    // repository config
    repositoryList: Array<RepositoryDto>;
    activeRepository: RepositoryDto;

    // forms
    repositoryToChangeTo = this.fb.control(null, Validators.required);
    newRepositoryForm = this.fb.control('', Validators.required);
    repositoryClearForm = this.fb.control(null, Validators.required);
    repositoryDeleteForm = this.fb.control(null, Validators.required);

    constructor(
        private messageService: MessagesService,
        private fb: FormBuilder,
        private repoService: RepositoryOperationsService,
        private changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.loadRepoInfo();
    }

    loadRepoInfo(): void {
        this.repoService.getListOfRepositories().pipe(take(1)).subscribe(data => {
            this.repositoryList = data;
        });
        this.repoService.getWorkingRepository().pipe(take(1)).subscribe(data => {
            this.activeRepository = data;
        });
    }

    /**
     * Selects a repository to be the working repo
     * @param repositoryName Name of the repository to select
     */
    setRepository(): void {
        if (this.repositoryToChangeTo.invalid) {
            this.messageService.warn('Ups!','It seems like you are missing some data here...');
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
            this.messageService.warn('Ups!','It seems like you are missing some data here...');
            return;
        }
        const repositoryName = this.newRepositoryForm.value.toString();
        const newRepositoryRequest: NewRepositoryRequestDto = { repositoryName: repositoryName };
        this.repoService.createRepository(newRepositoryRequest).pipe(take(1)).subscribe(() => {
            this.loadRepoInfo();
        });
    }

    clickClearRepository(): void {
        if (this.repositoryClearForm.invalid) {
            this.messageService.warn('Ups!','It seems like you are missing some data here...');
            return;
        }
        this.repoToConfirm = this.repositoryClearForm.value;
        this.openModal("clear");
    }

    clickDeleteRepository(): void {
        if (this.repositoryDeleteForm.invalid) {
            this.messageService.warn('Ups!','It seems like you are missing some data here...');
            return;
        }
        this.repoToConfirm = this.repositoryDeleteForm.value;
        this.openModal("delete");
    }

    openModal(operation: string): void {
        this.operationToConfirm = "none";
        // this is required in order for the modal to be reactivated after first use
        this.changeDetectorRef.detectChanges();
        this.operationToConfirm = operation;
    }

    onConfirmation(): void {
        this.repositoryDeleteForm.reset();
        this.repositoryClearForm.reset();
        if (this.operationToConfirm == "clear") {
            this.repoService.clearRepository(this.repoToConfirm.id).pipe(take(1)).subscribe();
        } else if (this.operationToConfirm == "delete") {
            this.repoService.deleteRepository(this.repoToConfirm.id).pipe(take(1)).subscribe();
            this.loadRepoInfo();
        }
        return;
    }

}
