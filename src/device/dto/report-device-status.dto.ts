import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString, ValidateNested } from "class-validator";
import { DeviceStatusDto } from "./device-status.dto";

export class ReportDeviceStatusDto {
   @IsString()
   @ApiProperty({ description: '디바이스 고유 키' })
   deviceId: string;

   @ApiProperty()
   @ValidateNested({ each: true })
   @Type(() => DeviceStatusDto)
   payload: DeviceStatusDto
}