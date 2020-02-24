const express = require('express');
const router = express.Router();
const OpcUaClientCreator = require('../opcUa_util/opc-ua-client');
const opcUaClient = require("node-opcua").OPCUAClient;
const NodeCrawler = require("node-opcua").NodeCrawler;
const OpcUaMappingCreator = require("../opcUa_util/opc-ua-mapper");


// crawl a server
router.post('/crawl-server', function (req, res) {
    const connectionOptions = req.body.connectionOptions;
    const endpointUrl = req.body.endpointUrl;
    connectAndCrawl();

    let crawlResult;
    async function connectAndCrawl() {
        const opcUaClientCreator = new OpcUaClientCreator(connectionOptions);
        const opcUaClient = await opcUaClientCreator.createClient();
        await opcUaClient.connect(endpointUrl);
        const session = await opcUaClient.createSession();
        
        const nodeCrawler = new NodeCrawler(session);
        nodeCrawler.read("ObjectsFolder").then(crawlResult => {
            res.status(200).json(crawlResult)
        });
    }
});

router.post('/mappings', function(req, res) {
    const opcUAJson = req.body;
    
    const opcUaMapper = new OpcUaMappingCreator(opcUAJson);
    const mapping = opcUaMapper.createMapping();
    console.log(mapping);
    
    res.status(200).json(mapping);
});

module.exports = router;