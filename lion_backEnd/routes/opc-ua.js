const express = require('express');
const router = express.Router();
const OpcUaClientCreator = require('../opcUa_util/opc-ua-client');
const opcUaClient = require("node-opcua").OPCUAClient;
const NodeCrawler = require("node-opcua").NodeCrawler;
const OpcUaMappingCreator = require("../opcUa_util/opc-ua-mapper");


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
    const opcUAJson = req.body;
    
    const opcUaMapper = new OpcUaMappingCreator(opcUAJson);
    const mapping = opcUaMapper.createMapping();
    
    res.status(200).json(mapping);
});

module.exports = router;