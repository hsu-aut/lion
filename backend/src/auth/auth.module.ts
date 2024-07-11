import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { UsersModule } from '../users/users.module';


@Module({
	imports: [
	Reflector,
	JwtModule.register({
		global: true,
// TODO remove form source code
		secret: 'DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.',
// TODO implement token that refreshes itself
		// signOptions: { expiresIn: '60s' },
		}),
	UsersModule
	],
	providers: [
	{ provide: APP_GUARD, useClass: AuthGuard },	// enable AuthGuard on all routes
	AuthService 
	],
	exports: [
	AuthService
	],
	})
export class AuthModule {}