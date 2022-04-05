import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class AdminDeviceRegisterDto {
   @IsNumber()
   @ApiProperty()
   userId: number;
   
   @IsString()
   @ApiProperty()
   deviceId: string;
}