import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'User`s name',
    example: 'Bruna Bomfim',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'User`s email',
    example: 'Bruna@gmail.com',
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'User`s password',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'If user is admin or server',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  role?: boolean;

  @ApiProperty({
    description: 'User-related institutes ID',
    example: ["8a4fd390-832d-4f4d-bb21-6face2cec010"],
  })
  @IsUUID( 'all', { each: true } )
  institutes?: string[];
}
