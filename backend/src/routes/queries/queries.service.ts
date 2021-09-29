import { Injectable } from '@nestjs/common';

@Injectable()
export class QuerieService {

	selectQuery(repositoryName:string):void{
		console.log(repositoryName);
	}
	insertQuery(repositoryName:string):void{
		console.log(repositoryName);
	}
}

