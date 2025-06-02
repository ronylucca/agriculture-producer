import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@/database/prisma/prisma.module';
import { HealthModule } from '@/modules/health/health.module';
import { ProducersModule } from '@/modules/producers/producers.module';
import { FarmsModule } from '@/modules/farms/farms.module';
import { CulturesModule } from '@/modules/cultures/cultures.module';
import { HarvestsModule } from '@/modules/harvests/harvests.module';
import { FarmCulturesModule } from '@/modules/farm-cultures/farm-cultures.module';
import { DashboardModule } from '@/modules/dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    PrismaModule,
    HealthModule,
    ProducersModule,
    FarmsModule,
    CulturesModule,
    HarvestsModule,
    FarmCulturesModule,
    DashboardModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {} 