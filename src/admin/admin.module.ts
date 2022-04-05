import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from 'src/device/entities/device.entity';
import { DeviceConfig } from 'src/device/entities/deviceConfig.entity';
import { DeviceStatus } from 'src/device/entities/deviceStatus.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Device, DeviceConfig, DeviceStatus])],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule {}
