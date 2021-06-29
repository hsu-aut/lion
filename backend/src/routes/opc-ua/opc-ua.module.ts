import { Module } from '@nestjs/common';
import { OpcUaController } from './opc-ua.controller';
// import { MulterModule } from '@nestjs/platform-express';
import { OpcUaService } from './opc-ua.service';

@Module({
	imports: [],
	controllers: [
		OpcUaController
	],
	providers: [
		OpcUaService
	],
})
export class OpcUaModule {

}

