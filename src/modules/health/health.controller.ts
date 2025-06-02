import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '@/database/prisma/prisma.service';

interface HealthResponse {
  status: string;
  timestamp: string;
  uptime: number;
  version: string;
  database: {
    status: string;
    connected: boolean;
  };
  endpoints: {
    swagger: string;
    producers: string;
    farms: string;
    cultures: string;
    harvests: string;
    farmCultures: string;
    dashboard: string;
  };
}

@ApiTags('Sistema')
@Controller()
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Status da aplicação e links úteis' })
  @ApiResponse({ 
    status: 200, 
    description: 'Status da aplicação',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        uptime: { type: 'number', example: 123.45 },
        version: { type: 'string', example: '1.0.0' },
        database: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'connected' },
            connected: { type: 'boolean', example: true },
          },
        },
        endpoints: {
          type: 'object',
          properties: {
            swagger: { type: 'string', example: '/api/v1/docs' },
            producers: { type: 'string', example: '/api/v1/producers' },
            farms: { type: 'string', example: '/api/v1/farms' },
            cultures: { type: 'string', example: '/api/v1/cultures' },
            harvests: { type: 'string', example: '/api/v1/harvests' },
            farmCultures: { type: 'string', example: '/api/v1/farm-cultures' },
            dashboard: { type: 'string', example: '/api/v1/dashboard' },
          },
        },
      },
    },
  })
  async getHealth(): Promise<HealthResponse> {
    const dbStatus = await this.checkDatabaseConnection();
    
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: '1.0.0',
      database: {
        status: dbStatus ? 'connected' : 'disconnected',
        connected: dbStatus,
      },
      endpoints: {
        swagger: '/api/v1/docs',
        producers: '/api/v1/producers',
        farms: '/api/v1/farms',
        cultures: '/api/v1/cultures',
        harvests: '/api/v1/harvests',
        farmCultures: '/api/v1/farm-cultures',
        dashboard: '/api/v1/dashboard',
      },
    };
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check da aplicação' })
  @ApiResponse({ status: 200, description: 'Aplicação funcionando' })
  async healthCheck(): Promise<{ status: string; database: boolean }> {
    const dbStatus = await this.checkDatabaseConnection();
    
    return {
      status: 'ok',
      database: dbStatus,
    };
  }

  private async checkDatabaseConnection(): Promise<boolean> {
    try {
      await this.prisma.healthCheck();
      return true;
    } catch {
      return false;
    }
  }
} 