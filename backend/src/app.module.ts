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
import { DINEN61360Module } from './routes/dinen61360/dinen61360.module';
import { TBoxModule } from './routes/t-box/t-box.module';
import { ISO224002Module } from './routes/iso224002/iso224002.module';
import { OdpModule } from './routes/odps/odp.module';
import { WadlModule } from './routes/wadl/wadl.module';
import { ISA88Module } from './routes/isa88/isa88.module';
import { Vdi2206Module } from './routes/vdi2206/vdi2206.module';
import { AuthRouteModule } from './routes/auth/auth-route.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { UserRouteModule } from './routes/user/user-route.module';


@Module({
	imports: [
	TBoxModule,
	OdpModule,
	FpbModule,
	StepModule,
	EclassSearchModule,
	GraphsModule,
	QueriesModule,
	RepositoriesModule,
	OpcUaModule,
	DINEN61360Module,
	ISO224002Module,
	WadlModule,
	ISA88Module,
	Vdi2206Module,
	AuthRouteModule,
	UserRouteModule,
	// uri schema: 'mongodb://username:password@host:port/database?options...'
	// uri schema for testing with docker (no user / no pw / port set to standard 27017): mongodb://host:port/database'
	MongooseModule.forRoot('mongodb://localhost/users'),
	UsersModule
	],
	controllers: [AppController],
	providers: [AppService],
	})
export class AppModule {}
