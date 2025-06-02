import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';
import { Producer } from '@prisma/client';

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class ProducersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProducerDto: CreateProducerDto): Promise<Producer> {
    try {
      return await this.prisma.producer.create({
        data: createProducerDto,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Este documento já está cadastrado');
      }
      throw error;
    }
  }

  async findAll(params: PaginationParams = {}): Promise<PaginatedResult<Producer>> {
    const { page = 1, limit = 10, search } = params;
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { document: { contains: search } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.producer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.producer.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Producer> {
    const producer = await this.prisma.producer.findUnique({
      where: { id },
      include: {
        farms: true,
      },
    });

    if (!producer) {
      throw new NotFoundException('Produtor não encontrado');
    }

    return producer;
  }

  async update(id: string, updateProducerDto: UpdateProducerDto): Promise<Producer> {
    try {
      return await this.prisma.producer.update({
        where: { id },
        data: updateProducerDto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Produtor não encontrado');
      }
      if (error.code === 'P2002') {
        throw new ConflictException('Este documento já está cadastrado');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.producer.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Produtor não encontrado');
      }
      throw error;
    }
  }
} 