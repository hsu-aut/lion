import { Module } from '@nestjs/common';
import { Vdi2206Controller } from './vdi2206.controller';
import { Vdi2206Service } from './vdi2206.service';

@Module({
	imports: [],
	controllers: [Vdi2206Controller],
	providers: [
		Vdi2206Service
	],
})
export class Vdi2206Module {}
