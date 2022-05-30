import { PartialType } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { SignInDto } from './sign-in.dto';

export class UpdateAuthDto {
  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  password: string;
}
