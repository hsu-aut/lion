import { Controller } from '@nestjs/common';
import { WadlService } from './wadl.service';

@Controller('lion_BE/wadl')
export class WadlController {
	
	constructor(private wadlService: WadlService ) { }


}
