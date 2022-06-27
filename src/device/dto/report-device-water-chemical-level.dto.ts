import { PickType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString, ValidateNested } from "class-validator";
import { DeviceConfigDto } from "./device-config.dto";

export class ReportDeviceWaterChemicalLevelDto {
   @IsString()
   @ApiProperty({ description: '디바이스 고유 키' })
   deviceId: string;

   @ApiProperty()
   @ValidateNested({ each: true })
   @Type(() => PickType(DeviceConfigDto, ['water_level'] as const))
   payload: Pick<DeviceConfigDto, 'water_level'>;
}
