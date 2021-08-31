import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EclassSearchModule } from './routes/eclass-search/eclass-search.module';
import { FpbModule } from './routes/fpb/fpb.module';
import { QueriesModule } from './routes/queries/queries.module';
import { StepModule } from './routes/step/step.module';


@Module({
	imports: [
		FpbModule,
		StepModule,
		EclassSearchModule,
		QueriesModule
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
