import { Controller, Delete, Get, Post} from '@nestjs/common';

@Controller('/lion_BE/repositories') 
export class RepositoriesController {
constructor() {}

var express = require('express');
var router = express.Router();
var url = require('url');

var GDB_TBOX = require('../GRAPH_DB_REQUESTS/tboxOperations.requests')
var GDB_REPO = require('../GRAPH_DB_REQUESTS/repositoryOperations.requests')
var gdbConfig = require('../GRAPH_DB_REQUESTS/GDBconfigurator')

// const curl = new (require('curl-request'))();
const axios = new (require('axios'))();
const FormData = require('form-data');
const fs = require('fs');

/**
 * GET list of repositories 
 */

// @Get()
// getListOfRepositories(): void {
//     GDB_REPO.GET_REPOSITORIES()

// }

/**
 *CREATE new repository 
*/ 

// @Get()
// getNewRepository():void {

// }

/** 
 * GET all RDF triples
 */

// @Get()
// getAllRdfTriples():void {

// }

/** 
 * DELETE all RDF triples  
 */
// @Delete()
// deleteAllRdfTriples():void {

// }

/** 
 * INSERT TBOX to repository  
 */

// @Get()
// insertTboxToRepository():void {

// }
// }
