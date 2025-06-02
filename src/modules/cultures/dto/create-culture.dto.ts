import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCultureDto {
  @ApiProperty({
    description: 'Nome da cultura',
    example: 'Soja',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
} 