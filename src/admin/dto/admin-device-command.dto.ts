import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { DeviceConfigDto } from 'src/device/dto/device-config.dto';

export class AdminDeviceCommandDto {
  @IsString()
  @ApiProperty()
  deviceId: string;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => PartialType(DeviceConfigDto))
  payload: Partial<DeviceConfigDto>;
}
