import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ReportDeviceSyncDto {
  @IsString()
  @ApiProperty({ description: '디바이스 고유 키' })
  deviceId: string;
}
