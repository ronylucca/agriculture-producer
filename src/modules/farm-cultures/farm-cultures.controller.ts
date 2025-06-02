import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { FarmCulturesService } from './farm-cultures.service';
import { CreateFarmCultureDto } from './dto/create-farm-culture.dto';

@ApiTags('Culturas das Fazendas')
@Controller('farm-cultures')
export class FarmCulturesController {
  constructor(private readonly farmCulturesService: FarmCulturesService) {}

  @Post()
  @ApiOperation({ summary: 'Associar cultura a uma fazenda em uma safra' })
  @ApiResponse({ status: 201, description: 'Associação criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Fazenda, cultura ou safra não encontrada' })
  @ApiResponse({ status: 409, description: 'Associação já existe' })
  create(@Body() createFarmCultureDto: CreateFarmCultureDto) {
    return this.farmCulturesService.create(createFarmCultureDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as associações fazenda-cultura' })
  @ApiResponse({ status: 200, description: 'Lista de associações' })
  findAll() {
    return this.farmCulturesService.findAll();
  }

  @Get('farm/:farmId')
  @ApiOperation({ summary: 'Listar culturas de uma fazenda específica' })
  @ApiParam({ name: 'farmId', description: 'ID da fazenda' })
  @ApiResponse({ status: 200, description: 'Lista de culturas da fazenda' })
  @ApiResponse({ status: 404, description: 'Fazenda não encontrada' })
  findByFarm(@Param('farmId') farmId: string) {
    return this.farmCulturesService.findByFarm(farmId);
  }

  @Get('culture/:cultureId')
  @ApiOperation({ summary: 'Listar fazendas que cultivam uma cultura específica' })
  @ApiParam({ name: 'cultureId', description: 'ID da cultura' })
  @ApiResponse({ status: 200, description: 'Lista de fazendas que cultivam a cultura' })
  @ApiResponse({ status: 404, description: 'Cultura não encontrada' })
  findByCulture(@Param('cultureId') cultureId: string) {
    return this.farmCulturesService.findByCulture(cultureId);
  }

  @Get('harvest/:harvestId')
  @ApiOperation({ summary: 'Listar associações por safra' })
  @ApiParam({ name: 'harvestId', description: 'ID da safra' })
  @ApiResponse({ status: 200, description: 'Lista de associações da safra' })
  @ApiResponse({ status: 404, description: 'Safra não encontrada' })
  findByHarvest(@Param('harvestId') harvestId: string) {
    return this.farmCulturesService.findByHarvest(harvestId);
  }

  @Get('farm/:farmId/harvest/:harvestId')
  @ApiOperation({ summary: 'Listar culturas de uma fazenda em uma safra específica' })
  @ApiParam({ name: 'farmId', description: 'ID da fazenda' })
  @ApiParam({ name: 'harvestId', description: 'ID da safra' })
  @ApiResponse({ status: 200, description: 'Lista de culturas da fazenda na safra' })
  @ApiResponse({ status: 404, description: 'Fazenda ou safra não encontrada' })
  findByFarmAndHarvest(
    @Param('farmId') farmId: string,
    @Param('harvestId') harvestId: string,
  ) {
    return this.farmCulturesService.findByFarmAndHarvest(farmId, harvestId);
  }

  @Post('farm/:farmId/culture/:cultureId')
  @ApiOperation({ summary: 'Adicionar cultura a uma fazenda' })
  @ApiParam({ name: 'farmId', description: 'ID da fazenda' })
  @ApiParam({ name: 'cultureId', description: 'ID da cultura' })
  @ApiQuery({ name: 'harvestId', description: 'ID da safra' })
  @ApiResponse({ status: 201, description: 'Cultura adicionada com sucesso' })
  @ApiResponse({ status: 404, description: 'Fazenda, cultura ou safra não encontrada' })
  addCultureToFarm(
    @Param('farmId') farmId: string,
    @Param('cultureId') cultureId: string,
    @Query('harvestId') harvestId: string,
  ) {
    return this.farmCulturesService.addCultureToFarm(farmId, cultureId, harvestId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover associação específica por ID' })
  @ApiParam({ name: 'id', description: 'ID da associação' })
  @ApiResponse({ status: 204, description: 'Associação removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Associação não encontrada' })
  removeById(@Param('id') id: string) {
    return this.farmCulturesService.removeById(id);
  }

  @Delete('farm/:farmId/culture/:cultureId/harvest/:harvestId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover associação específica fazenda-cultura-safra' })
  @ApiParam({ name: 'farmId', description: 'ID da fazenda' })
  @ApiParam({ name: 'cultureId', description: 'ID da cultura' })
  @ApiParam({ name: 'harvestId', description: 'ID da safra' })
  @ApiResponse({ status: 204, description: 'Associação removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Associação não encontrada' })
  remove(
    @Param('farmId') farmId: string,
    @Param('cultureId') cultureId: string,
    @Param('harvestId') harvestId: string,
  ) {
    return this.farmCulturesService.remove(farmId, cultureId, harvestId);
  }

  @Delete('farm/:farmId/culture/:cultureId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover cultura de uma fazenda (todas as safras)' })
  @ApiParam({ name: 'farmId', description: 'ID da fazenda' })
  @ApiParam({ name: 'cultureId', description: 'ID da cultura' })
  @ApiResponse({ status: 204, description: 'Cultura removida da fazenda com sucesso' })
  removeCultureFromFarm(
    @Param('farmId') farmId: string,
    @Param('cultureId') cultureId: string,
  ) {
    return this.farmCulturesService.removeCultureFromFarm(farmId, cultureId);
  }
} 