import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';
import { SummaryResponseDto, ChartItemDto, LandUseItemDto } from './dto/dashboard.dto';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(): Promise<SummaryResponseDto> {
    const [totalFarms, totalHectaresResult] = await Promise.all([
      this.prisma.farm.count(),
      this.prisma.farm.aggregate({
        _sum: {
          totalArea: true,
        },
      }),
    ]);

    return {
      totalFarms,
      totalHectares: Number(totalHectaresResult._sum.totalArea || 0),
    };
  }

  async getChartByState(harvestId?: string): Promise<ChartItemDto[]> {
    const whereClause = harvestId
      ? {
          farmCultures: {
            some: {
              harvestId,
            },
          },
        }
      : {};

    const farms = await this.prisma.farm.findMany({
      where: whereClause,
      select: {
        state: true,
      },
    });

    const stateCounts = farms.reduce((acc, farm) => {
      acc[farm.state] = (acc[farm.state] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const total = farms.length;

    return Object.entries(stateCounts).map(([state, count]) => ({
      name: state,
      count,
      percentage: total > 0 ? Number(((count / total) * 100).toFixed(1)) : 0,
    }));
  }

  async getChartByCulture(harvestId?: string): Promise<ChartItemDto[]> {
    const whereClause = harvestId ? { harvestId } : {};

    const farmCultures = await this.prisma.farmCulture.findMany({
      where: whereClause,
      include: {
        culture: true,
      },
    });

    const cultureCounts = farmCultures.reduce((acc, farmCulture) => {
      const cultureName = farmCulture.culture.name;
      acc[cultureName] = (acc[cultureName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const total = farmCultures.length;

    return Object.entries(cultureCounts).map(([culture, count]) => ({
      name: culture,
      count,
      percentage: total > 0 ? Number(((count / total) * 100).toFixed(1)) : 0,
    }));
  }

  async getChartByLandUse(): Promise<LandUseItemDto[]> {
    const result = await this.prisma.farm.aggregate({
      _sum: {
        arableArea: true,
        vegetationArea: true,
        totalArea: true,
      },
    });

    const arableArea = Number(result._sum.arableArea || 0);
    const vegetationArea = Number(result._sum.vegetationArea || 0);
    const totalArea = Number(result._sum.totalArea || 0);

    const usedArea = arableArea + vegetationArea;

    return [
      {
        type: 'Área Agricultável',
        totalArea: arableArea,
        percentage: totalArea > 0 ? Number(((arableArea / totalArea) * 100).toFixed(1)) : 0,
      },
      {
        type: 'Vegetação',
        totalArea: vegetationArea,
        percentage: totalArea > 0 ? Number(((vegetationArea / totalArea) * 100).toFixed(1)) : 0,
      },
    ];
  }
} 