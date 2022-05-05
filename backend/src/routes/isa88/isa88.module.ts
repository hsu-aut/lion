import { Module } from '@nestjs/common';
import { ISA88Controller } from './isa88.controller';
import { ISA88Service } from './isa88.service';

@Module({
	imports: [],
	controllers: [ISA88Controller],
	providers: [ISA88Service],
})
export class ISA88Module {}
