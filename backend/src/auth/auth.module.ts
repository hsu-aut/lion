import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { AuthGuard } from './auth.guard';
import { APP_GUARD, Reflector } from '@nestjs/core';


@Module({
	imports: [
	Reflector,
	JwtModule.register({
		global: true,
		// TODO remove form source code
		secret: 'DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.',
		// TODO implement token that refreshes itself
		signOptions: { expiresIn: '60s' },
		}),
	],
	providers: [
	{ provide: APP_GUARD, useClass: AuthGuard },	// enable AuthGuard on all routes
	AuthService, 
	UsersService,
	],
	exports: [
	AuthService,
	UsersService
	],
	})
export class AuthModule {}