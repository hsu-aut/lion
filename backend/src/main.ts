import { NestFactory } from '@nestjs/core';
import { BackendModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(BackendModule);
	await app.listen(3000);
}
bootstrap();
