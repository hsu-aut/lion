import { Controller, Delete, Get, Post} from '@nestjs/common';

@Controller('/lion_BE/repositories') 
export class RepositoriesController {
constructor() {}

/**
 * GET list of repositories 
 */

@Get()
getListOfRepositories():void {
}

/**
 *CREATE new repository 
*/ 

@Get()
getNewRepository():void {

}

/** 
 * GET all RDF triples
 */

@Get()
getAllRdfTriples():void {

}

/** 
 * DELETE all RDF triples  
 */
@Delete()
deleteAllRdfTriples():void {

}

/** 
 * INSERT TBOX to repository  
 */

@Get()
insertTboxToRepository():void {

}
}
