// This is currently identical to the GraphUpdate, but could in the future be used to store additional data (e.g. creator, dateCreated...)
export class GraphDto {
    constructor(public graphIri: string) {}
}