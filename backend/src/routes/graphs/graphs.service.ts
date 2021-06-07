import { Injectable } from '@nestjs/common';
import { URL } from 'url';
@Injectable()
export class GraphsService {

	getTriplesOfNamedGraph(): string {
		return "hello World Get Triples of Named Graph";
	}
	setTriplesOfNamedGraph(): string {
		return "hello World     setTriplesOfNamedGraph(): string";
	}
	deleteNamedGraph(): string {
		return "hello World deleteNamedGraph";
	}
}
