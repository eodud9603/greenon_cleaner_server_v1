import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsNumber, IsString, ValidateNested } from "class-validator";
import { DeviceConfigDto } from "./device-config.dto";

export class DeviceControlDto {
   @IsString()
   deviceId:string;

   @IsNumber()
   userId:number;

   @ValidateNested({ each: true })
   @Type(() => PartialType(DeviceConfigDto))
   payload: Partial<DeviceConfigDto>
}