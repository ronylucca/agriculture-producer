import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID, IsEnum, IsPositive, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { BrazilianStates } from '@/common/enums/brazilian-states.enum';
import { IsValidAreaSum } from '@/common/validators/area-sum.validator';

export class CreateFarmDto {
  @ApiProperty({
    description: 'ID do produtor dono da fazenda',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  producerId: string;

  @ApiProperty({
    description: 'Nome da fazenda',
    example: 'Fazenda Santa Rita',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Cidade onde a fazenda está localizada',
    example: 'Ribeirão Preto',
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    description: 'Estado onde a fazenda está localizada',
    enum: BrazilianStates,
    example: BrazilianStates.SP,
  })
  @IsEnum(BrazilianStates)
  state: BrazilianStates;

  @ApiProperty({
    description: 'Área total da fazenda em hectares',
    example: 1000.5,
  })
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsPositive()
  totalArea: number;

  @ApiProperty({
    description: 'Área agricultável em hectares',
    example: 800.3,
  })
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsPositive()
  arableArea: number;

  @ApiProperty({
    description: 'Área de vegetação em hectares',
    example: 200.2,
  })
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsPositive()
  vegetationArea: number;

  @IsValidAreaSum()
  validateAreaSum?: boolean;
} 