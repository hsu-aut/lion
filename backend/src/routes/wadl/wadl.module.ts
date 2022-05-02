import { Module } from '@nestjs/common';
import { WadlController } from './wadl.controller';
import { WadlService } from './wadl.service';

@Module({
	imports: [],
	controllers: [WadlController],
	providers: [WadlService],
})
export class WadlModule {}
