import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { BackendService } from './app.service';
import { EclassSearchModule } from './routes/eclass-search/eclass-search.module';
import { FpbModule } from './routes/fpb/fpb.module';
import { StepModule } from './routes/step/step.module';
import { GraphsModule } from './routes/graphs/graphs.module';
import { OpcUaModule } from './routes/opc-ua/opc-ua.module';


@Module({
	imports: [
		FpbModule,
		StepModule,
		EclassSearchModule,
		GraphsModule,
		OpcUaModule
	],
	controllers: [AppController],
	providers: [BackendService],
})
export class AppModule {}
