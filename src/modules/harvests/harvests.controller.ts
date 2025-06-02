import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { HarvestsService } from './harvests.service';
import { CreateHarvestDto } from './dto/create-harvest.dto';
import { UpdateHarvestDto } from './dto/update-harvest.dto';
import { PaginationParams } from '../producers/producers.service';

@ApiTags('Safras')
@Controller('harvests')
export class HarvestsController {
  constructor(private readonly harvestsService: HarvestsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova safra' })
  @ApiResponse({ status: 201, description: 'Safra criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Safra já cadastrada' })
  create(@Body() createHarvestDto: CreateHarvestDto) {
    return this.harvestsService.create(createHarvestDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar safras com paginação' })
  @ApiQuery({ name: 'page', required: false, description: 'Número da página' })
  @ApiQuery({ name: 'limit', required: false, description: 'Itens por página' })
  @ApiQuery({ name: 'search', required: false, description: 'Buscar por nome ou ano' })
  @ApiResponse({ status: 200, description: 'Lista de safras' })
  findAll(@Query() query: PaginationParams) {
    return this.harvestsService.findAll(query);
  }

  @Get('recent')
  @ApiOperation({ summary: 'Listar safras mais recentes' })
  @ApiQuery({ name: 'limit', required: false, description: 'Quantidade de safras' })
  @ApiResponse({ status: 200, description: 'Lista de safras recentes' })
  findRecent(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 5;
    return this.harvestsService.findRecent(limitNum);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar safra por ID' })
  @ApiResponse({ status: 200, description: 'Safra encontrada' })
  @ApiResponse({ status: 404, description: 'Safra não encontrada' })
  findOne(@Param('id') id: string) {
    return this.harvestsService.findOne(id);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Obter estatísticas de uma safra específica' })
  @ApiParam({ name: 'id', description: 'ID da safra' })
  @ApiResponse({ status: 200, description: 'Estatísticas da safra' })
  @ApiResponse({ status: 404, description: 'Safra não encontrada' })
  getStats(@Param('id') id: string) {
    return this.harvestsService.getStatsByHarvest(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar safra' })
  @ApiResponse({ status: 200, description: 'Safra atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Safra não encontrada' })
  @ApiResponse({ status: 409, description: 'Safra já cadastrada' })
  update(@Param('id') id: string, @Body() updateHarvestDto: UpdateHarvestDto) {
    return this.harvestsService.update(id, updateHarvestDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar safra' })
  @ApiResponse({ status: 204, description: 'Safra deletada com sucesso' })
  @ApiResponse({ status: 404, description: 'Safra não encontrada' })
  remove(@Param('id') id: string) {
    return this.harvestsService.remove(id);
  }
} 