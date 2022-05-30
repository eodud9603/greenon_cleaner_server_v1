import { PartialType } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { SignInDto } from './sign-in.dto';

export class verifyPasswrodDto {
  @IsString()
  password: string;
}
