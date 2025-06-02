import { Module } from '@nestjs/common';
import { FarmCulturesService } from './farm-cultures.service';
import { FarmCulturesController } from './farm-cultures.controller';

@Module({
  controllers: [FarmCulturesController],
  providers: [FarmCulturesService],
  exports: [FarmCulturesService],
})
export class FarmCulturesModule {} 