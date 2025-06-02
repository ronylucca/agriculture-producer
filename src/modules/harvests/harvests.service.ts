import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';
import { CreateHarvestDto } from './dto/create-harvest.dto';
import { UpdateHarvestDto } from './dto/update-harvest.dto';
import { Harvest } from '@prisma/client';
import { PaginationParams, PaginatedResult } from '../producers/producers.service';

@Injectable()
export class HarvestsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createHarvestDto: CreateHarvestDto): Promise<Harvest> {
    try {
      // Validar ano
      const currentYear = new Date().getFullYear();
      if (createHarvestDto.year < 1900 || createHarvestDto.year > currentYear + 10) {
        throw new BadRequestException(`O ano deve estar entre 1900 e ${currentYear + 10}`);
      }

      return await this.prisma.harvest.create({
        data: createHarvestDto,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Esta safra já está cadastrada');
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw error;
    }
  }

  async findAll(params: PaginationParams = {}): Promise<PaginatedResult<Harvest>> {
    const { page = 1, limit = 10, search } = params;
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            ...(isNaN(Number(search)) ? [] : [{ year: Number(search) }]),
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.harvest.findMany({
        where,
        skip,
        take: limit,
        include: {
          farmCultures: {
            include: {
              farm: {
                include: {
                  producer: true,
                },
              },
              culture: true,
            },
          },
        },
        orderBy: { year: 'desc' },
      }),
      this.prisma.harvest.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Harvest> {
    const harvest = await this.prisma.harvest.findUnique({
      where: { id },
      include: {
        farmCultures: {
          include: {
            farm: {
              include: {
                producer: true,
              },
            },
            culture: true,
          },
        },
      },
    });

    if (!harvest) {
      throw new NotFoundException('Safra não encontrada');
    }

    return harvest;
  }

  async update(id: string, updateHarvestDto: UpdateHarvestDto): Promise<Harvest> {
    try {
      // Validar ano se fornecido
      if (updateHarvestDto.year) {
        const currentYear = new Date().getFullYear();
        if (updateHarvestDto.year < 1900 || updateHarvestDto.year > currentYear + 10) {
          throw new BadRequestException(`O ano deve estar entre 1900 e ${currentYear + 10}`);
        }
      }

      return await this.prisma.harvest.update({
        where: { id },
        data: updateHarvestDto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Safra não encontrada');
      }
      if (error.code === 'P2002') {
        throw new ConflictException('Esta safra já está cadastrada');
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.harvest.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Safra não encontrada');
      }
      throw error;
    }
  }

  async findRecent(limit: number = 5): Promise<Harvest[]> {
    return await this.prisma.harvest.findMany({
      take: limit,
      orderBy: { year: 'desc' },
      include: {
        farmCultures: {
          include: {
            farm: true,
            culture: true,
          },
        },
      },
    });
  }

  async getStatsByHarvest(harvestId: string): Promise<any> {
    const harvest = await this.prisma.harvest.findUnique({
      where: { id: harvestId },
      include: {
        farmCultures: {
          include: {
            farm: true,
            culture: true,
          },
        },
      },
    });

    if (!harvest) {
      throw new NotFoundException('Safra não encontrada');
    }

    const stats = {
      harvestName: harvest.name,
      year: harvest.year,
      totalFarms: harvest.farmCultures.length,
      cultures: harvest.farmCultures.reduce((acc, fc) => {
        const cultureName = fc.culture.name;
        acc[cultureName] = (acc[cultureName] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      totalArea: harvest.farmCultures.reduce((total, fc) => {
        return total + Number(fc.farm.totalArea);
      }, 0),
    };

    return stats;
  }
} 