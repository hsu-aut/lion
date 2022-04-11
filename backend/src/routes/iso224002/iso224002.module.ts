import { Module } from '@nestjs/common';
import { ISO224002Controller } from './iso224002.controller';
import { ISO224002Service } from './iso224002.service';

@Module({
	imports: [],
	controllers: [ISO224002Controller],
	providers: [ISO224002Service],
})
export class ISO224002Module {}
