import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { urlencoded, json } from 'express';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.use(json({ limit: '50mb' }));
	app.use(urlencoded({ extended: true, limit: '50mb' }));
	app.enableCors();
	await app.listen(3000);
}
bootstrap();
