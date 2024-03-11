import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/auth.module';
import { AuthRouteController } from './auth-route.controller';

@Module({
	imports: [
	AuthModule
	],
	controllers: [
	AuthRouteController
	],
	})
export class AuthRouteModule {}