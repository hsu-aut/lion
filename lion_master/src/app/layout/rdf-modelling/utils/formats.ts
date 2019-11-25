interface Formats {
    RDF_XML: FormatDescription;
    N_Triples: FormatDescription;
    Turtle: FormatDescription;
    N3: FormatDescription;
    N_Quads: FormatDescription;
    JSON_LD: FormatDescription;
    RDF_JSON: FormatDescription;
    TriX: FormatDescription;
    TriG: FormatDescription;
}
export interface FormatDescription {
    formatName: string;
    MIME_type: string;
    fileEnding: string;
}


export class DataDescription {

    public ContentTypes: Formats = {

        RDF_XML:    { formatName: "RDF/XML", MIME_type: "application/rdf+xml", fileEnding: ".xml" },
        N_Triples:  { formatName: "N-Triples", MIME_type: "text/plain", fileEnding: ".ttl" },
        Turtle:     { formatName: "Turtle", MIME_type: "text/turtle", fileEnding: ".ttl" },
        N3:         { formatName: "N3", MIME_type: "text/rdf+n3", fileEnding: ".n3" },
        N_Quads:    { formatName: "N-Quads", MIME_type: "text/x-nquads", fileEnding: ".nq" },
        JSON_LD:    { formatName: "JSON-LD", MIME_type: "application/ld+json", fileEnding: ".json" },
        RDF_JSON:   { formatName: "RDF/JSON", MIME_type: "application/rdf+json", fileEnding: ".json" },
        TriX:       { formatName: "TriX", MIME_type: "application/trix", fileEnding: ".xml" },
        TriG:       { formatName: "TriG", MIME_type: "application/x-trig", fileEnding: ".ttl" }
    }

}