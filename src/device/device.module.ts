import { Module } from '@nestjs/common';
import { DeviceService } from './device.service';
import { DeviceController } from './device.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './entities/device.entity';
import { DeviceStatus } from './entities/deviceStatus.entity';
import { DeviceConfig } from './entities/deviceConfig.entity';
import { DeviceSerial } from './entities/deviceSerial.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Device, DeviceConfig, DeviceStatus, DeviceSerial])],
  controllers: [DeviceController],
  providers: [DeviceService]
})
export class DeviceModule {}