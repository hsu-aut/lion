import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { EclassSearchModule } from './routes/eclass-search/eclass-search.module';
import { FpbModule } from './routes/fpb/fpb.module';
import { QueriesModule } from './routes/queries/queries.module';
import { RepositoriesModule } from './routes/repositories/repositories.module';
import { StepModule } from './routes/step/step.module';
import { GraphsModule } from './routes/graphs/graphs.module';
import { OpcUaModule } from './routes/opc-ua/opc-ua.module';
import { AppService } from './app.service';


@Module({
	imports: [
		FpbModule,
		StepModule,
		EclassSearchModule,
		GraphsModule,
		QueriesModule,
		RepositoriesModule,
		OpcUaModule
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
