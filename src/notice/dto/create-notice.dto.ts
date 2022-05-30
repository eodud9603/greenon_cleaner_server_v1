import { IsOptional, IsString } from "class-validator";

export class CreateNoticeDto {
   @IsString()
   title: string;
   
   @IsString()
   content: string;
   
   @IsString()
   @IsOptional()
   imgUri?: string;
}