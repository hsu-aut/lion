import { Module } from '@nestjs/common';
import { UserRouteController } from './user-route.controller';
import { SharedServiceModule } from '../../shared-services/shared-service.module';
import { UsersModule } from '../../users/users.module';
import { UserRouteService } from './user-route.service';

@Module({
	imports: [
	SharedServiceModule,
	UsersModule
	],
	providers: [
	UserRouteService
	],
	controllers: [
	UserRouteController
	],
	})
export class UserRouteModule {}