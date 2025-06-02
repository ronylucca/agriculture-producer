import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';
import { CreateCultureDto } from './dto/create-culture.dto';
import { UpdateCultureDto } from './dto/update-culture.dto';
import { Culture } from '@prisma/client';
import { PaginationParams, PaginatedResult } from '../producers/producers.service';

@Injectable()
export class CulturesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCultureDto: CreateCultureDto): Promise<Culture> {
    try {
      return await this.prisma.culture.create({
        data: createCultureDto,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Esta cultura já está cadastrada');
      }
      throw error;
    }
  }

  async findAll(params: PaginationParams = {}): Promise<PaginatedResult<Culture>> {
    const { page = 1, limit = 10, search } = params;
    const skip = (page - 1) * limit;

    const where = search
      ? {
          name: { contains: search, mode: 'insensitive' as const },
        }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.culture.findMany({
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
              harvest: true,
            },
          },
        },
        orderBy: { name: 'asc' },
      }),
      this.prisma.culture.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Culture> {
    const culture = await this.prisma.culture.findUnique({
      where: { id },
      include: {
        farmCultures: {
          include: {
            farm: {
              include: {
                producer: true,
              },
            },
            harvest: true,
          },
        },
      },
    });

    if (!culture) {
      throw new NotFoundException('Cultura não encontrada');
    }

    return culture;
  }

  async update(id: string, updateCultureDto: UpdateCultureDto): Promise<Culture> {
    try {
      return await this.prisma.culture.update({
        where: { id },
        data: updateCultureDto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Cultura não encontrada');
      }
      if (error.code === 'P2002') {
        throw new ConflictException('Esta cultura já está cadastrada');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.culture.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Cultura não encontrada');
      }
      throw error;
    }
  }

  async findPopular(): Promise<any[]> {
    const cultures = await this.prisma.culture.findMany({
      include: {
        farmCultures: true,
      },
    });

    return cultures
      .map(culture => ({
        id: culture.id,
        name: culture.name,
        farmsCount: culture.farmCultures.length,
      }))
      .sort((a, b) => b.farmsCount - a.farmsCount)
      .slice(0, 10);
  }
} 