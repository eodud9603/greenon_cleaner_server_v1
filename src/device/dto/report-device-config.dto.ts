import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { DeviceConfigDto } from "./device-config.dto";

export class ReportDeviceConfigDto {
   @IsNumber()
   @IsOptional()
   @ApiProperty({ description: '디바이스 고유 키' })
   userId: number;

   @IsString()
   @ApiProperty({ description: '디바이스 고유 키' })
   deviceId: string;

   @ApiProperty()
   @ValidateNested({ each: true })
   @Type(() => DeviceConfigDto)
   payload: DeviceConfigDto;
}
