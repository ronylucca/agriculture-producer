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
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CulturesService } from './cultures.service';
import { CreateCultureDto } from './dto/create-culture.dto';
import { UpdateCultureDto } from './dto/update-culture.dto';
import { PaginationParams } from '../producers/producers.service';

@ApiTags('Culturas')
@Controller('cultures')
export class CulturesController {
  constructor(private readonly culturesService: CulturesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova cultura' })
  @ApiResponse({ status: 201, description: 'Cultura criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Cultura já cadastrada' })
  create(@Body() createCultureDto: CreateCultureDto) {
    return this.culturesService.create(createCultureDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar culturas com paginação' })
  @ApiQuery({ name: 'page', required: false, description: 'Número da página' })
  @ApiQuery({ name: 'limit', required: false, description: 'Itens por página' })
  @ApiQuery({ name: 'search', required: false, description: 'Buscar por nome da cultura' })
  @ApiResponse({ status: 200, description: 'Lista de culturas' })
  findAll(@Query() query: PaginationParams) {
    return this.culturesService.findAll(query);
  }

  @Get('popular')
  @ApiOperation({ summary: 'Listar culturas mais populares' })
  @ApiResponse({ status: 200, description: 'Lista de culturas mais cultivadas' })
  findPopular() {
    return this.culturesService.findPopular();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar cultura por ID' })
  @ApiResponse({ status: 200, description: 'Cultura encontrada' })
  @ApiResponse({ status: 404, description: 'Cultura não encontrada' })
  findOne(@Param('id') id: string) {
    return this.culturesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar cultura' })
  @ApiResponse({ status: 200, description: 'Cultura atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Cultura não encontrada' })
  @ApiResponse({ status: 409, description: 'Cultura já cadastrada' })
  update(@Param('id') id: string, @Body() updateCultureDto: UpdateCultureDto) {
    return this.culturesService.update(id, updateCultureDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar cultura' })
  @ApiResponse({ status: 204, description: 'Cultura deletada com sucesso' })
  @ApiResponse({ status: 404, description: 'Cultura não encontrada' })
  remove(@Param('id') id: string) {
    return this.culturesService.remove(id);
  }
} 