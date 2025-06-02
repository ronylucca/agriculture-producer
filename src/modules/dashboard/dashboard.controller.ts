import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { SummaryResponseDto, ChartItemDto, LandUseItemDto } from './dto/dashboard.dto';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Obter resumo do dashboard' })
  @ApiResponse({ 
    status: 200, 
    description: 'Resumo obtido com sucesso',
    type: SummaryResponseDto,
  })
  getSummary(): Promise<SummaryResponseDto> {
    return this.dashboardService.getSummary();
  }

  @Get('charts/by-state')
  @ApiOperation({ summary: 'Obter gráfico de fazendas por estado' })
  @ApiQuery({ 
    name: 'harvestId', 
    required: false, 
    description: 'ID da safra para filtrar' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Dados do gráfico por estado',
    type: [ChartItemDto],
  })
  getChartByState(@Query('harvestId') harvestId?: string): Promise<ChartItemDto[]> {
    return this.dashboardService.getChartByState(harvestId);
  }

  @Get('charts/by-culture')
  @ApiOperation({ summary: 'Obter gráfico de fazendas por cultura' })
  @ApiQuery({ 
    name: 'harvestId', 
    required: false, 
    description: 'ID da safra para filtrar' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Dados do gráfico por cultura',
    type: [ChartItemDto],
  })
  getChartByCulture(@Query('harvestId') harvestId?: string): Promise<ChartItemDto[]> {
    return this.dashboardService.getChartByCulture(harvestId);
  }

  @Get('charts/by-land-use')
  @ApiOperation({ summary: 'Obter gráfico de uso da terra' })
  @ApiResponse({ 
    status: 200, 
    description: 'Dados do gráfico de uso da terra',
    type: [LandUseItemDto],
  })
  getChartByLandUse(): Promise<LandUseItemDto[]> {
    return this.dashboardService.getChartByLandUse();
  }
} 