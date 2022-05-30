import { IsString } from 'class-validator';

export class SignUpDto {
  @IsString()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  password: string;
}
