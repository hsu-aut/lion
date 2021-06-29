import { Injectable } from '@nestjs/common';


@Injectable()
export class GraphsService {

	getTriplesOfNamedGraph(repositoryName: string, graph: string, format: string): string {
		console.log(repositoryName);
		console.log(graph);
		console.log(format);
		return "";
	}
	setTriplesOfNamedGraph(repositoryName: string, graph: string, format: string, triples : string): string {
		console.log(repositoryName);
		console.log(graph);
		console.log(format);
		console.log(triples);
		return "";
	}
	deleteNamedGraph(repositoryName: string, graph: string): string {
		console.log(repositoryName);
		console.log(graph);
		return "";
	}
}
