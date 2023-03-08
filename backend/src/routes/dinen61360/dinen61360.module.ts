import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DINEN61360Controller } from './dinen61360.controller';
import { DINEN61360Service } from './dinen61360.service';

@Module({
	imports: [HttpModule], // todo: remove (probably)
	controllers: [DINEN61360Controller],
	providers: [DINEN61360Service],
})
export class DINEN61360Module {}
