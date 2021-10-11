import { HttpService, Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { createPool, Pool } from 'mysql2/promise';
import { ConnectionOptions } from 'mysql2';
import { AxiosRequestConfig } from 'axios';
import { Agent } from 'https';
import { EclassProperty } from './eclass-property.interface'; //todo: change to @shared folder


@Injectable()
export class EclassSearchService { 

	constructor(private readonly httpService: HttpService) {}
	
	private pool: Pool;  //config for mysql db -- todo: also instantiate in constructor?
	private requestConfig: AxiosRequestConfig; //config for requests to the eclass webservice, including the webservice certificate

	//
	// sql database
	//

	//connect pool
	async connectDB(): Promise<void> {
		try {
			//read db config from json file
			const dbConfig: ConnectionOptions = JSON.parse(readFileSync('./eclass-db-config.json', 'utf-8'));
			//establish pool connection with db config
			this.pool = createPool(dbConfig);
		} catch (err) {
			console.error('db connection error: ' + err);
		}
	}

	//disconnect pool
	async disconnectDB(): Promise<void> {
		try {
			if (this.pool) {
				// dsiconnect pool
				this.pool.end();
				this.pool = null;
			} else {
				// throw error if no pool is connected
				throw new Error('no connection established');
			}
		} catch (err) {
			console.error('db disconnection error: ' + err);
		}
	}

	//execute query

	async getPropertiesByNameFromDB(propName: string): Promise<EclassProperty[]> {
		try {
			// query string
			const queryString =
				`SELECT p.IrdiPR, p.PreferredName, p.Definition, p.DataType, u.ShortName 
      			FROM eclass11_1_pr_de AS p
      			LEFT OUTER JOIN eclass11_1_un_de AS u 
				ON p.IrdiUN = u.IrdiUN
      			WHERE p.PreferredName LIKE '%${propName}%'`;
			
			if (this.pool) {	//only proceed if pool has been created

				//get complete query results
				const allResults = await this.pool.query(queryString);

				//get only rows ([0]) as they conatin the data
				//any: workaround, dont know if that can be fixed :(
				const rows: any = allResults[0];

				//map values from single property according to EclassProperty interface and return them as one array
				return rows.map(singleProperty => {
					return {
						"irdi": singleProperty.IrdiPR,
						"preferredName": singleProperty.PreferredName,
						"definition": singleProperty.Definition,
						"dataType": singleProperty.DataType,
						"unitShortName": singleProperty.ShortName,
					};});
			} else {
				// throw error if no pool is connected
				throw new Error('no connection established');
			}
		} catch (err) {
			console.error('query error: ' + err);
		}
	}

	//
	// webservice
	//
	
	//function for creating the request configuration which includes the webservice ertificate
	async createRequestConfig(): Promise<void> {
		try {
			this.requestConfig = {
				headers: {
					"Accept-Language": "de-DE",	//add option to change this in frontend
					"depreceated": false,
				},
				//still testing - todo: find solution for certificate handling
				httpsAgent: new Agent({
					pfx: readFileSync("C:/Users/Weigawnd/code/eclass-ws-certificate/35-HSU_Webservice.full.pfx"),
				}),
			};
		} catch (err) {
			console.error('certificate error: ' + err);
		}
	}

	//function for requesting a single property by its irdi
	async requestSingleProperty(reuqestString: string): Promise<EclassProperty> {

		//propertyResponse: request to requesting information about a single property https://eclass-cdp.com//jsonapi/v1/properties/{irdi}
		const propertyResponse = await this.httpService.get(reuqestString, this.requestConfig).toPromise();

		if (propertyResponse.data.unit == undefined) {  //if property with no unit is found 
			return {
				"irdi": propertyResponse.data.irdi,
				"preferredName": propertyResponse.data.preferredName["de-DE"],
				"definition": propertyResponse.data.definition["de-DE"],
				"dataType": propertyResponse.data.propertyDataType,
				"unitShortName": null,
			};	

		} else {  //if property with unit is found
			//unitResponse: response to requesting information about a single unit https://eclass-cdp.com//jsonapi/v1/units/{irdi}
			const unitResponse = await this.httpService.get(propertyResponse.data.unit.href, this.requestConfig).toPromise();
			return {
				"irdi": propertyResponse.data.irdi,
				"preferredName": propertyResponse.data.preferredName["de-DE"],
				"definition": propertyResponse.data.definition["de-DE"],
				"dataType": propertyResponse.data.propertyDataType,
				"unitShortName": unitResponse.data.shortName["de-DE"],
			};
		}
	}

	//get a list of all matching eclass properties and request all information about them
	async getPropertiesByNameFromWebService(propName: string): Promise<EclassProperty[]> {

		//request url -- max number of results hardcoded, change with &limit=x
		const requestUrl = `https://eclass-cdp.com/jsonapi/v1/properties?release=LATEST&preferredName=${propName}&limit=5&offset=0`;

		//propertyResponse: response to requesting a list of properties
		const propertiesResponse = await this.httpService.get(requestUrl, this.requestConfig).toPromise();

		//empty array of property requests
		const propertyRequests:Promise<EclassProperty>[] = [];
		//push requests to array
		for (let i = 0; i < propertiesResponse.data.totalResults; ++i) {
			propertyRequests.push(this.requestSingleProperty(propertiesResponse.data.data[i].href));
		}

		//execute all requests at once and return results as soon as all promises have been fulfilled / all responses arrived
		return await Promise.all(propertyRequests);
	}
}

//original query string
//contains fields that are not requestable by webservice
// 		`SELECT p.Identifier, p.VersionNumber, p.RevisionNumber, p.PreferredName, p.ShortName, 
//		p.Definition, p.DataType, uom.DINNotation 
// 		FROM eclassproperty AS p
// 		LEFT OUTER JOIN eclassunit AS uom ON p.IrdiUN = uom.IrdiUN
// 		WHERE PreferredName LIKE '%${propName}%'`;