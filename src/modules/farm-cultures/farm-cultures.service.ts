import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';
import { CreateFarmCultureDto } from './dto/create-farm-culture.dto';
import { FarmCulture } from '@prisma/client';

@Injectable()
export class FarmCulturesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFarmCultureDto: CreateFarmCultureDto): Promise<FarmCulture> {
    try {
      // Verificar se fazenda existe
      const farm = await this.prisma.farm.findUnique({
        where: { id: createFarmCultureDto.farmId },
      });

      if (!farm) {
        throw new NotFoundException('Fazenda não encontrada');
      }

      // Verificar se cultura existe
      const culture = await this.prisma.culture.findUnique({
        where: { id: createFarmCultureDto.cultureId },
      });

      if (!culture) {
        throw new NotFoundException('Cultura não encontrada');
      }

      // Verificar se safra existe
      const harvest = await this.prisma.harvest.findUnique({
        where: { id: createFarmCultureDto.harvestId },
      });

      if (!harvest) {
        throw new NotFoundException('Safra não encontrada');
      }

      return await this.prisma.farmCulture.create({
        data: createFarmCultureDto,
        include: {
          farm: {
            include: {
              producer: true,
            },
          },
          culture: true,
          harvest: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Esta cultura já está associada a esta fazenda nesta safra');
      }
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw error;
    }
  }

  async findAll(): Promise<FarmCulture[]> {
    return await this.prisma.farmCulture.findMany({
      include: {
        farm: {
          include: {
            producer: true,
          },
        },
        culture: true,
        harvest: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByFarm(farmId: string): Promise<FarmCulture[]> {
    const farm = await this.prisma.farm.findUnique({
      where: { id: farmId },
    });

    if (!farm) {
      throw new NotFoundException('Fazenda não encontrada');
    }

    return await this.prisma.farmCulture.findMany({
      where: { farmId },
      include: {
        culture: true,
        harvest: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByCulture(cultureId: string): Promise<FarmCulture[]> {
    const culture = await this.prisma.culture.findUnique({
      where: { id: cultureId },
    });

    if (!culture) {
      throw new NotFoundException('Cultura não encontrada');
    }

    return await this.prisma.farmCulture.findMany({
      where: { cultureId },
      include: {
        farm: {
          include: {
            producer: true,
          },
        },
        harvest: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByHarvest(harvestId: string): Promise<FarmCulture[]> {
    const harvest = await this.prisma.harvest.findUnique({
      where: { id: harvestId },
    });

    if (!harvest) {
      throw new NotFoundException('Safra não encontrada');
    }

    return await this.prisma.farmCulture.findMany({
      where: { harvestId },
      include: {
        farm: {
          include: {
            producer: true,
          },
        },
        culture: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByFarmAndHarvest(farmId: string, harvestId: string): Promise<FarmCulture[]> {
    // Verificar se fazenda existe
    const farm = await this.prisma.farm.findUnique({
      where: { id: farmId },
    });

    if (!farm) {
      throw new NotFoundException('Fazenda não encontrada');
    }

    // Verificar se safra existe
    const harvest = await this.prisma.harvest.findUnique({
      where: { id: harvestId },
    });

    if (!harvest) {
      throw new NotFoundException('Safra não encontrada');
    }

    return await this.prisma.farmCulture.findMany({
      where: {
        farmId,
        harvestId,
      },
      include: {
        culture: true,
        harvest: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(farmId: string, cultureId: string, harvestId: string): Promise<void> {
    try {
      await this.prisma.farmCulture.delete({
        where: {
          farmId_cultureId_harvestId: {
            farmId,
            cultureId,
            harvestId,
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Associação não encontrada');
      }
      throw error;
    }
  }

  async removeById(id: string): Promise<void> {
    try {
      await this.prisma.farmCulture.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Associação não encontrada');
      }
      throw error;
    }
  }

  async addCultureToFarm(farmId: string, cultureId: string, harvestId: string): Promise<FarmCulture> {
    return this.create({ farmId, cultureId, harvestId });
  }

  async removeCultureFromFarm(farmId: string, cultureId: string): Promise<void> {
    try {
      // Remove todas as associações desta cultura com esta fazenda (em todas as safras)
      await this.prisma.farmCulture.deleteMany({
        where: {
          farmId,
          cultureId,
        },
      });
    } catch (error) {
      throw error;
    }
  }
} 