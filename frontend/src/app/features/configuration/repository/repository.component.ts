import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { RepositoryOperationsService } from '@shared-services/backEnd/repositoryOperations.service';


@Component({
    selector: 'app-repository',
    templateUrl: './repository.component.html',
    styleUrls: ['./repository.component.scss']
})
export class RepositoryComponent implements OnInit {

    // stats
    repoCount: number;

    constructor(
        private repoService: RepositoryOperationsService,
    ) {}

    ngOnInit(): void {
        this.getRepoCount();
    }


    getRepoCount(): void {
        this.repoService.getListOfRepositories().pipe(take(1)).subscribe(data => {
            this.repoCount = data.length;
        });
    }

}
