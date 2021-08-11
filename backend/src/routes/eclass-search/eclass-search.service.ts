import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { createPool, Pool } from 'mysql2/promise';
import { ConnectionOptions } from 'mysql2';

@Injectable()
export class EclassSearchService {
	private pool: Pool;

	async connectDb(): Promise<void> {
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
	async disconnectDb(): Promise<void> {
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
	//todo: define type of returned values

	async getPropertiesByNamefromDb(propName: string): Promise<any> {
		try {
			// query string
			const queryString =
				`SELECT p.Identifier, p.VersionNumber, p.RevisionNumber, p.PreferredName, p.ShortName, p.Definition, p.DataType, uom.DINNotation 
      FROM eclassproperty AS p
      LEFT OUTER JOIN eclassunit AS uom ON p.IrdiUN = uom.IrdiUN
      WHERE PreferredName LIKE '%${propName}%'`;

			if (this.pool) {
				// db.query returns [rows, fields] - read rows only
				const [rows] = await this.pool.query(queryString);
				return rows;
			} else {
				// throw error if no pool is connected
				throw new Error('no connection established');
			}
		} catch (err) {
			console.error('query error: ' + err);
		}
	}
}

// old code: manual error handling

// } catch (error) {
//   if (error.code === 'PROTOCOL_CONNECTION_LOST') {
//     console.error('Database connection was closed.');
//   }
//   if (error.code === 'ER_CON_COUNT_ERROR') {
//     console.error('Database has too many connections.');
//   }
//   if (error.code === 'ECONNREFUSED') {
//     console.error('Database connection was refused.');
//   }
// }
