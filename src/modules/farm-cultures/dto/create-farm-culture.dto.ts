import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateFarmCultureDto {
  @ApiProperty({
    description: 'ID da fazenda',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  farmId: string;

  @ApiProperty({
    description: 'ID da cultura',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  cultureId: string;

  @ApiProperty({
    description: 'ID da safra',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  @IsUUID()
  harvestId: string;
} 