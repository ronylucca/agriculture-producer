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
import { FarmsService } from './farms.service';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { PaginationParams } from '../producers/producers.service';

@ApiTags('Fazendas')
@Controller('farms')
export class FarmsController {
  constructor(private readonly farmsService: FarmsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova fazenda' })
  @ApiResponse({ status: 201, description: 'Fazenda criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado' })
  create(@Body() createFarmDto: CreateFarmDto) {
    return this.farmsService.create(createFarmDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar fazendas com paginação' })
  @ApiQuery({ name: 'page', required: false, description: 'Número da página' })
  @ApiQuery({ name: 'limit', required: false, description: 'Itens por página' })
  @ApiQuery({ name: 'search', required: false, description: 'Buscar por nome, cidade ou produtor' })
  @ApiResponse({ status: 200, description: 'Lista de fazendas' })
  findAll(@Query() query: PaginationParams) {
    return this.farmsService.findAll(query);
  }

  @Get('producer/:producerId')
  @ApiOperation({ summary: 'Listar fazendas de um produtor específico' })
  @ApiParam({ name: 'producerId', description: 'ID do produtor' })
  @ApiResponse({ status: 200, description: 'Lista de fazendas do produtor' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado' })
  findByProducer(@Param('producerId') producerId: string) {
    return this.farmsService.findByProducer(producerId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar fazenda por ID' })
  @ApiResponse({ status: 200, description: 'Fazenda encontrada' })
  @ApiResponse({ status: 404, description: 'Fazenda não encontrada' })
  findOne(@Param('id') id: string) {
    return this.farmsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar fazenda' })
  @ApiResponse({ status: 200, description: 'Fazenda atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Fazenda não encontrada' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  update(@Param('id') id: string, @Body() updateFarmDto: UpdateFarmDto) {
    return this.farmsService.update(id, updateFarmDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar fazenda' })
  @ApiResponse({ status: 204, description: 'Fazenda deletada com sucesso' })
  @ApiResponse({ status: 404, description: 'Fazenda não encontrada' })
  remove(@Param('id') id: string) {
    return this.farmsService.remove(id);
  }
} 