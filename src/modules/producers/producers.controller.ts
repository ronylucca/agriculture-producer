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
import { ProducersService, PaginationParams } from './producers.service';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';

@ApiTags('Produtores')
@Controller('producers')
export class ProducersController {
  constructor(private readonly producersService: ProducersService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo produtor' })
  @ApiResponse({ status: 201, description: 'Produtor criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Documento já cadastrado' })
  create(@Body() createProducerDto: CreateProducerDto) {
    return this.producersService.create(createProducerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar produtores com paginação' })
  @ApiQuery({ name: 'page', required: false, description: 'Número da página' })
  @ApiQuery({ name: 'limit', required: false, description: 'Itens por página' })
  @ApiQuery({ name: 'search', required: false, description: 'Buscar por nome ou documento' })
  @ApiResponse({ status: 200, description: 'Lista de produtores' })
  findAll(@Query() query: PaginationParams) {
    return this.producersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar produtor por ID' })
  @ApiResponse({ status: 200, description: 'Produtor encontrado' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado' })
  findOne(@Param('id') id: string) {
    return this.producersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar produtor' })
  @ApiResponse({ status: 200, description: 'Produtor atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado' })
  @ApiResponse({ status: 409, description: 'Documento já cadastrado' })
  update(@Param('id') id: string, @Body() updateProducerDto: UpdateProducerDto) {
    return this.producersService.update(id, updateProducerDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar produtor' })
  @ApiResponse({ status: 204, description: 'Produtor deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado' })
  remove(@Param('id') id: string) {
    return this.producersService.remove(id);
  }
} 