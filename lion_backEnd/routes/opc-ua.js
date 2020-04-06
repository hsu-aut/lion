const express = require('express');
const router = express.Router();
const OpcUaClientCreator = require('../opcUa_util/opc-ua-client');
const opcUaClient = require("node-opcua").OPCUAClient;
const NodeCrawler = require("node-opcua").NodeCrawler;
const OpcUaMappingCreator = require("../opcUa_util/opc-ua-mapper");
const sparqlUpdate = require('../GRAPH_DB_REQUESTS/sparqlQueries.requests').SAPRQL_UPDATE;


// crawl a server
router.post('/crawl-server', function (req, res) {
    const serverInfo = req.body;
    connectAndCrawl();

    let crawlResult;
    async function connectAndCrawl() {
        const opcUaClientCreator = new OpcUaClientCreator(serverInfo);
        const opcUaClient = await opcUaClientCreator.createClient();
        await opcUaClient.connect(serverInfo.endpointUrl);
        const session = await opcUaClient.createSession();
        
        const nodeCrawler = new NodeCrawler(session);
        nodeCrawler.read("RootFolder").then(crawlResult => {
            res.status(200).json(crawlResult)
        });
    }
});

router.post('/mappings', function(req, res) {
    const dataToMap = req.body;
    const repository = dataToMap.repository;

    const opcUaMapper = new OpcUaMappingCreator(dataToMap.opc);
    const mapping = opcUaMapper.createMapping();

    sparqlUpdate(mapping, repository).then(queryRes => {
        res.status(200).json(queryRes);
    }).catch(err => {
        res.status(500).json(err);
    })
});

module.exports = router;