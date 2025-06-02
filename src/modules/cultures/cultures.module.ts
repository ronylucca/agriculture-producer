import { Module } from '@nestjs/common';
import { CulturesService } from './cultures.service';
import { CulturesController } from './cultures.controller';

@Module({
  controllers: [CulturesController],
  providers: [CulturesService],
  exports: [CulturesService],
})
export class CulturesModule {} 