import { Injectable } from '@nestjs/common';

@Injectable()
export class GraphDbRepositoryService {


	getCurrentRepository(): string {
		return "test-repo";
	}

}
