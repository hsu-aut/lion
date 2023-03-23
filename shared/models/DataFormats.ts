export enum DataFormat {
    RDF_XML,
    N_Triples,
    Turtle,
    N3,
    N_Quads,
    JSON_LD,
    RDF_JSON,
    TriX,
    TriG,
}
export interface FormatDescription {
    formatName: string;
    MIME_type: string;
    fileEnding: string;
}


export class DataFormatHandler {

    public static contentTypes: Map<DataFormat, FormatDescription> = new Map([
        [DataFormat.RDF_XML, { formatName: "RDF/XML", MIME_type: "application/rdf+xml", fileEnding: ".xml" }],
        [DataFormat.N_Triples, { formatName: "N-Triples", MIME_type: "text/plain", fileEnding: ".nt" }],
        [DataFormat.Turtle, { formatName: "Turtle", MIME_type: "text/turtle", fileEnding: ".ttl" }],
        [DataFormat.N3, { formatName: "N3", MIME_type: "text/rdf+n3", fileEnding: ".n3" }],
        [DataFormat.N_Quads, { formatName: "N-Quads", MIME_type: "text/x-nquads", fileEnding: ".nq" }],
        [DataFormat.RDF_JSON, { formatName: "RDF/JSON", MIME_type: "application/rdf+json", fileEnding: ".json" }],
        [DataFormat.JSON_LD, { formatName: "JSON-LD", MIME_type: "application/ld+json", fileEnding: ".jsonld" }],
        [DataFormat.TriX, { formatName: "TriX", MIME_type: "application/trix", fileEnding: ".trix" }],
        [DataFormat.TriG, { formatName: "TriG", MIME_type: "application/x-trig", fileEnding: ".trig" }]
    ]);

    public static getFormatDescriptions(): Array<FormatDescription> {
        return Array.from(this.contentTypes.values());
    }

    public static getMimeTypeByFileEnding(fileEnding: string): string {
        const values = Array.from(this.contentTypes.values());
        const foundValue = values.find(val => val.fileEnding === fileEnding);
        return foundValue.MIME_type;
    }

}
