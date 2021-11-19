import { Module } from '@nestjs/common';
import { OpcUaController } from './opc-ua.controller';
// import { MulterModule } from '@nestjs/platform-express';
import { OpcUaService } from './opc-ua.service';
import { OpcUaClientCreator } from './opc-ua-client.service';
import { OpcUaMappingCreator } from './opc-ua-mapper.service';

@Module({
	imports: [],
	controllers: [OpcUaController],
	providers: [
		OpcUaService,
		// OpcUaClientCreator,
		// OpcUaMappingCreator
	],
})
export class OpcUaModule {

}

