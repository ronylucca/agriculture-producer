import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateHarvestDto {
  @ApiProperty({
    description: 'Nome da safra',
    example: 'Safra 2024',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Ano da safra',
    example: 2024,
    minimum: 1900,
    maximum: 2100,
  })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1900)
  @Max(2100)
  year: number;
} 