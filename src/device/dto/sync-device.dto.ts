import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString, ValidateNested } from "class-validator";
import { DeviceConfigDto } from "./device-config.dto";

export class SyncDeviceDto {
   @IsString()
   @ApiProperty({ description: '디바이스 고유 키' })
   deviceId: string;

   @ApiProperty()
   @ValidateNested({ each: true })
   @Type(() => DeviceConfigDto)
   payload: DeviceConfigDto;
}