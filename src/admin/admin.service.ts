import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Device } from 'src/device/entities/device.entity';
import { DeviceConfig } from 'src/device/entities/deviceConfig.entity';
import { DeviceStatus } from 'src/device/entities/deviceStatus.entity';
import { Connection, IsNull, Not, Repository } from 'typeorm';
import { AdminDeviceCommandDto } from './dto/admin-device-command.dto';
import { AdminDeviceRegisterDto } from './dto/admin-device-register.dto';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class AdminService {
  constructor(
    private connection: Connection,

    @InjectRepository(Device)
    private readonly deviceRepo: Repository<Device>,
    @InjectRepository(DeviceStatus)
    private readonly deviceStatusRepo: Repository<DeviceStatus>,
    @InjectRepository(DeviceConfig)
    private readonly deviceConfigRepo: Repository<DeviceConfig>,
  ) { }

  /*
    * * * * * *
    | | | | | |
    | | | | | day of week
    | | | | months
    | | | day of month
    | | hours
    | minutes
    seconds (optional)
  */
 /* 12:00AM on the first of every month */
  /* @Cron('0 0 1 * *')
  async flushDeletedRows () {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.delete(DeviceConfig, { deletedAt: Not(IsNull()) });
      await queryRunner.manager.delete(DeviceStatus, { deletedAt: Not(IsNull()) });
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  } */

  async registerDevice (data:AdminDeviceRegisterDto) {
    let isUpdated = false;
    const { userId, deviceId } = data;
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const isDeviceExist = await queryRunner.manager.count(Device, {
        where: { id: deviceId, userId: null },
      });

      if (isDeviceExist === 1) {
        await queryRunner.manager.update(Device, deviceId, { userId });
        await queryRunner.commitTransaction();
        isUpdated = true;
      }
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
      return isUpdated;
    }
  }

  async sendCommand (data:AdminDeviceCommandDto) {
    let isSuccess = true;
    const { deviceId, payload } = data;

    const commands = Object.keys(payload);
    if (!commands.length || commands.length > 1) {
      return false;
    }

    const command = Object.keys(payload)[0];
    const value = payload[command];

    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.upsert(DeviceConfig, [{ deviceId, command, value, createdAt: new Date() }], ['deviceId', 'command']);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      isSuccess = false;
    } finally {
      await queryRunner.release();
      return isSuccess;
    }
  }

  // async getDeviceConnection (deviceId:string) {

  // }

  async getDeviceStatus (deviceId:string) {
    const statusList = await this.deviceStatusRepo.find({
      where: { deviceId, deletedAt: null },
      order: { createdAt: 'ASC' },
      select: [
        'createdAt',
        'particulate_matter',
        'temperature',
        'humidity',
        'bio_aerosol',
        'air_quality',
        'food_poisoning',
        'hydrogen_sulfide',
        'ammonia',
        'voc',
        'co2'
      ]
    });

    return statusList;

    // const queryRunner = this.connection.createQueryRunner();

    // await queryRunner.connect();
    // await queryRunner.startTransaction();

    // try {
    //   await queryRunner.manager.softDelete(DeviceStatus, { deviceId });
    //   await queryRunner.commitTransaction();
    // } catch (e) {
    //   await queryRunner.rollbackTransaction();
    // } finally {
    //   await queryRunner.release();
    //   return statusList;
    // }
  };


  // async getDeviceWaterAndChemicalLevel (deviceId:string) {

  // }

  async getDeviceConfigs (deviceId:string) {
    return await this.deviceRepo.find({
      where: { id: deviceId },
      select: [
        'updatedAt',
        'power',
        'mode',
        'mode_time',
        'air_volume',
        'air_quality',
        'water_level',
      ]
    });
  }
}
