export class NewRepositoryRequestDto {
    constructor(
        public repositoryId: string,
        public repositoryName: string
    ) {}
}