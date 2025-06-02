import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { IsValidCpfCnpj } from '@/common/validators/cpf-cnpj.validator';

export class CreateProducerDto {
  @ApiProperty({
    description: 'Nome do produtor rural',
    example: 'João Silva',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'CPF (11 dígitos) ou CNPJ (14 dígitos) do produtor',
    example: '12345678901',
  })
  @IsValidCpfCnpj()
  document: string;
} 