import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { Farm } from '@prisma/client';
import { PaginationParams, PaginatedResult } from '../producers/producers.service';

@Injectable()
export class FarmsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFarmDto: CreateFarmDto): Promise<Farm> {
    try {
      // Verificar se o produtor existe
      const producer = await this.prisma.producer.findUnique({
        where: { id: createFarmDto.producerId },
      });

      if (!producer) {
        throw new NotFoundException('Produtor não encontrado');
      }

      // Validar áreas
      if (createFarmDto.arableArea + createFarmDto.vegetationArea > createFarmDto.totalArea) {
        throw new BadRequestException('A soma da área agricultável e área de vegetação não pode ser maior que a área total');
      }

      return await this.prisma.farm.create({
        data: createFarmDto,
        include: {
          producer: true,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw error;
    }
  }

  async findAll(params: PaginationParams = {}): Promise<PaginatedResult<Farm>> {
    const { page = 1, limit = 10, search } = params;
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { city: { contains: search, mode: 'insensitive' as const } },
            { producer: { name: { contains: search, mode: 'insensitive' as const } } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.farm.findMany({
        where,
        skip,
        take: limit,
        include: {
          producer: true,
          farmCultures: {
            include: {
              culture: true,
              harvest: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.farm.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Farm> {
    const farm = await this.prisma.farm.findUnique({
      where: { id },
      include: {
        producer: true,
        farmCultures: {
          include: {
            culture: true,
            harvest: true,
          },
        },
      },
    });

    if (!farm) {
      throw new NotFoundException('Fazenda não encontrada');
    }

    return farm;
  }

  async update(id: string, updateFarmDto: UpdateFarmDto): Promise<Farm> {
    try {
      // Verificar se a fazenda existe
      const existingFarm = await this.prisma.farm.findUnique({
        where: { id },
      });

      if (!existingFarm) {
        throw new NotFoundException('Fazenda não encontrada');
      }

      // Se está atualizando producerId, verificar se existe
      if (updateFarmDto.producerId) {
        const producer = await this.prisma.producer.findUnique({
          where: { id: updateFarmDto.producerId },
        });

        if (!producer) {
          throw new NotFoundException('Produtor não encontrado');
        }
      }

      // Validar áreas se estão sendo atualizadas
      const totalArea = updateFarmDto.totalArea ?? existingFarm.totalArea;
      const arableArea = updateFarmDto.arableArea ?? existingFarm.arableArea;
      const vegetationArea = updateFarmDto.vegetationArea ?? existingFarm.vegetationArea;

      if (Number(arableArea) + Number(vegetationArea) > Number(totalArea)) {
        throw new BadRequestException('A soma da área agricultável e área de vegetação não pode ser maior que a área total');
      }

      return await this.prisma.farm.update({
        where: { id },
        data: updateFarmDto,
        include: {
          producer: true,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.farm.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Fazenda não encontrada');
      }
      throw error;
    }
  }

  async findByProducer(producerId: string): Promise<Farm[]> {
    const producer = await this.prisma.producer.findUnique({
      where: { id: producerId },
    });

    if (!producer) {
      throw new NotFoundException('Produtor não encontrado');
    }

    return await this.prisma.farm.findMany({
      where: { producerId },
      include: {
        farmCultures: {
          include: {
            culture: true,
            harvest: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
} 