import { ApiProperty } from '@nestjs/swagger';

export class SummaryResponseDto {
  @ApiProperty({
    description: 'Total de fazendas cadastradas',
    example: 50,
  })
  totalFarms: number;

  @ApiProperty({
    description: 'Total de hectares',
    example: 15000.5,
  })
  totalHectares: number;
}

export class ChartItemDto {
  @ApiProperty({
    description: 'Nome do item do gráfico',
    example: 'SP',
  })
  name: string;

  @ApiProperty({
    description: 'Quantidade/valor',
    example: 10,
  })
  count: number;

  @ApiProperty({
    description: 'Percentual do total',
    example: 25.5,
  })
  percentage: number;
}

export class LandUseItemDto {
  @ApiProperty({
    description: 'Tipo de uso da terra',
    example: 'Área Agricultável',
  })
  type: string;

  @ApiProperty({
    description: 'Área total em hectares',
    example: 1500.5,
  })
  totalArea: number;

  @ApiProperty({
    description: 'Percentual do total',
    example: 65.2,
  })
  percentage: number;
} 