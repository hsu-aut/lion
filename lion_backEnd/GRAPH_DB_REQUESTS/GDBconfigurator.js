const fs = require('fs');


exports.setRepository = function (name) {

    var promise = new Promise(function (resolve) {
        var configString = `
        # RDF4J configuration template for a GraphDB Free repository
        
        @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.
        @prefix rep: <http://www.openrdf.org/config/repository#>.
        @prefix sr: <http://www.openrdf.org/config/repository/sail#>.
        @prefix sail: <http://www.openrdf.org/config/sail#>.
        @prefix owlim: <http://www.ontotext.com/trree/owlim#>.
        
        [] a rep:Repository ;
            rep:repositoryID "${name}" ;
            rdfs:label "GraphDB Free repository" ;
            rep:repositoryImpl [
                rep:repositoryType "graphdb:FreeSailRepository" ;
                sr:sailImpl [
                    sail:sailType "graphdb:FreeSail" ;
        
                    owlim:base-URL "http://example.org/graphdb#" ;
                    owlim:defaultNS "" ;
                    owlim:entity-index-size "10000000" ;
                    owlim:entity-id-size  "32" ;
                    owlim:imports "" ;
                    owlim:repository-type "file-repository" ;
                    owlim:ruleset "owl2-rl-optimized" ;
                    owlim:storage-folder "storage" ;
        
                    owlim:enable-context-index "false" ;
        
                    owlim:enablePredicateList "true" ;
        
                    owlim:in-memory-literal-properties "true" ;
                    owlim:enable-literal-index "true" ;
        
                    owlim:check-for-inconsistencies "true" ;
                    owlim:disable-sameAs  "false" ;
                    owlim:query-timeout  "0" ;
                    owlim:query-limit-results  "0" ;
                    owlim:throw-QueryEvaluationException-on-timeout "false" ;
                    owlim:read-only "false" ;
                    owlim:nonInterpretablePredicates "http://www.w3.org/2000/01/rdf-schema#label;http://www.w3.org/1999/02/22-rdf-syntax-ns#type;http://www.ontotext.com/owlim/ces#gazetteerConfig;http://www.ontotext.com/owlim/ces#metadataConfig" ;
                ]
            ].
        `;
        fs.writeFile("./GRAPHDB_NEW_REPO_CONFIG.ttl", configString, (err) => {
            if (err) reject("err");
            resolve("created new file");
          });

    });


    

    return promise
}

