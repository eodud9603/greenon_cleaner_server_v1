import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, IsNull, Repository, UpdateDateColumn } from 'typeorm';
import { DeviceControlDto } from './dto/device-control.dto';
import { ReportDeviceConfigDto } from './dto/report-device-config.dto';
import { ReportDeviceStatusDto } from './dto/report-device-status.dto';
import { ReportDeviceSyncDto } from './dto/report-device-sync.dto';
import { SyncDeviceDto } from './dto/sync-device.dto';
import { Device } from './entities/device.entity';
import { DeviceConfig } from './entities/deviceConfig.entity';
import { DeviceSerial } from './entities/deviceSerial.entity';
import { DeviceStatus } from './entities/deviceStatus.entity';

const getRandom = (min:number, max:number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //최댓값도 포함, 최솟값도 포함
}

@Injectable()
export class DeviceService {
  constructor(
    private connection: Connection,

    @InjectRepository(Device)
    private readonly deviceRepo: Repository<Device>,
    @InjectRepository(DeviceStatus)
    private readonly deviceStatusRepo: Repository<DeviceStatus>,
    @InjectRepository(DeviceConfig)
    private readonly deviceConfigRepo: Repository<DeviceConfig>,
    @InjectRepository(DeviceSerial)
    private readonly deviceSerialRepo: Repository<DeviceSerial>,
  ) { }

  async init(data: SyncDeviceDto) {
    let result = true;
    const { deviceId, payload } = data;
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.upsert(Device, [{ id: deviceId, ...payload }], ['id']);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      result = false;
    } finally {
      await queryRunner.release();
      return { result };
    }
  }

  async reportConfigs(data: ReportDeviceConfigDto) {
    let result = true;
    const { userId, deviceId, payload } = data;

    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // await queryRunner.manager.update(Device, deviceId, { ...payload, userId });
      await queryRunner.manager.upsert(Device, [{ id: deviceId, serial: deviceId, ...payload, userId }], ['id']);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      result = false;
      console.log(e);
    } finally {
      await queryRunner.release();
      return { result };
    }
  }

  // async reportWaterAndChemicalLevel (data:ReportDeviceWaterChemicalLevelDto) {
  //   let isSuccess = true;
  //   const { deviceId, payload } = data;
  //   const queryRunner = this.connection.createQueryRunner();

  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();

  //   try {
  //     await queryRunner.manager.update(Device, deviceId, payload);
  //     await queryRunner.commitTransaction();
  //   } catch (e) {
  //     await queryRunner.rollbackTransaction();
  //     isSuccess = false;
  //   } finally {
  //     await queryRunner.release();
  //     return isSuccess;
  //   }
  // }

  async reportStatus(data: ReportDeviceStatusDto) {
    let result = true;
    const { deviceId, payload } = data;
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    console.log('start :: ',await queryRunner.startTransaction());

    try {
      await queryRunner.manager.save(DeviceStatus, { deviceId, ...payload },{ reload: false });
      // console.log('======================================================================');
      // console.log('device report status success ::',{ deviceId, ...payload });
      // console.log('======================================================================');
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      // console.log('device report status fail ::',{ deviceId, ...payload });
      console.log(e);
      result = false;
    } finally {
      await queryRunner.release();
      return { result };
    }
  }

  async reportSync(data: ReportDeviceSyncDto) {
    let result = true;
    const { deviceId } = data;
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.update(Device, deviceId, { updatedAt: new Date() });
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      console.log(e);
      result = false;
    } finally {
      await queryRunner.release();
      return { result };
    }
  }

  async getConfigs(deviceId: string) {
    const configList = await this.deviceConfigRepo.find({
      where: { deviceId },
      select: ['command', 'value']
    });

    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.delete(DeviceConfig, { deviceId });
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
      return configList;
    }
  }

  /* app */
  async verifySerial (serial:string) {
    const verified = await this.deviceSerialRepo.findOne(serial);

    if (verified) return { result: true };
    else return { result: false };
  }

  async bulkInsert () {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (let i = 1; i <= 100; i++) {
        await queryRunner.manager.save(DeviceSerial, { serial: `ABT1000-${('0000' + i).slice(-4)}` });
      }
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
      return true;
    }
  }

  getUserDevices(userId: number) {
    return this.deviceRepo.find({
      where: { userId },
      order: { 'createdAt': 'DESC' },
      select: ['id', 'name', 'serial', 'type', 'power', 'mode', 'mode_time', 'is_working', 'water_level', 'chemical_level']
    });
  }

  async getUserDevicesCurrentStatus(userId: number) {
    const devices = await this.getUserDevices(userId);
    let result = {};
    for (let i = 0; i < devices.length; i++) {
      const deviceId = devices[i].id;
      const status = await this.deviceStatusRepo.findOne({
        where: { deviceId },
        order: { 'createdAt': 'DESC' }
      });
      result[deviceId] = status;
    }
    return result;
  }

  async getUserDeviceStatus(id: string, userId: number) {
    let result = await this.deviceRepo.createQueryBuilder('device')
      .where({ id, userId })
      .leftJoinAndSelect('device.status', 'status', 'DATE_FORMAT(status.createdAt, "%Y-%m-%d") = CURDATE()')
      .getMany();

    console.log('getuser :: ',result);

    return result.map(r => {
      return {
        ...r,
        status: r.status.map(s => {
          return {
            createdAt: s.createdAt,
            particulate_matter: s.particulate_matter,
            temperature: s.temperature,
            humidity: s.humidity,
            bio_aerosol: s.bio_aerosol,
            air_quality: s.air_quality,
            food_poisoning: s.food_poisoning,
            hydrogen_sulfide: s.hydrogen_sulfide,
            ammonia: s.ammonia,
            voc: s.voc,
            co2: s.co2,
          };
        })
      };
    });
  }

  //TODO:: 일,주,월 쿼리 작성 한 뒤 프론트에서 버튼 클릭 시 마다 api 호출
  async getCumulativeData(id: string,type: string) {
    let result;
    if(type === 'day'){
      result = await this.deviceStatusRepo.createQueryBuilder('status')
        // .where(`deviceId = '${id}' and DATE_FORMAT(createdAt,"%Y-%m-%d") = CURDATE()`)
        .select('status.*')
        .where(`deviceId = '${id}' and createdAt BETWEEN DATE_ADD(NOW(),INTERVAL -1 DAY ) and NOW()`)
        .getRawMany();
    } else{
      let query = ' and ';
      if(type === 'week') query += 'createdAt BETWEEN DATE_ADD(NOW(),INTERVAL -1 WEEK ) and NOW()';
      else if(type === 'month') query += 'createdAt BETWEEN DATE_ADD(NOW(),INTERVAL -1 MONTH ) and NOW()';
      result = await this.deviceStatusRepo.createQueryBuilder('status')
        .select('DATE_FORMAT(status.createdAt, "%Y-%m-%d") as createdAt')
        .addSelect('sum(status.particulate_matter)/count(*) as particulate_matter')
        .addSelect('sum(status.temperature)/count(*) as temperature')
        .addSelect('sum(status.humidity)/count(*) as humidity')
        .addSelect('sum(status.bio_aerosol)/count(*) as bio_aerosol')
        .addSelect('sum(status.air_quality)/count(*) as air_quality')
        .addSelect('sum(status.food_poisoning)/count(*) as food_poisoning')
        .addSelect('sum(status.hydrogen_sulfide)/count(*) as hydrogen_sulfide')
        .addSelect('sum(status.ammonia)/count(*) as ammonia')
        .addSelect('sum(status.voc)/count(*) as voc')
        .addSelect('sum(status.co2)/count(*) as co2')
        .where(`deviceId = '${id}'${query}`)
        .groupBy('DATE_FORMAT(createdAt, "%Y-%m-%d")')
        .getRawMany();
    }
    // and DATE_FORMAT(createdAt, '%Y-%m-%d') <= CURDATE()
    console.log(result);
    return result;
  }

  async getUserDeviceConfigs (userId:number) {
    return this.deviceRepo.find({ where: { userId } });
  }

  async registerUserDevice(id: string, userId: number) {
    let result = { isSuccess: true, affected: 0 };
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const update = await queryRunner.manager.update(Device, { id, userId: IsNull() }, { userId });
      result.affected = update.affected || 0;
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      result.isSuccess = false;
    } finally {
      await queryRunner.release();
      return result;
    }
  }

  async updateUserDevice(deviceId: string, name: string) {
    let result = { isSuccess: true, affected: 0 };
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const update = await queryRunner.manager.update(Device, { id:deviceId }, { name : name });
      result.affected = update.affected || 0;
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      result.isSuccess = false;
    } finally {
      await queryRunner.release();
      return result;
    }
  }

  async unregisterUserDevice(id: string, userId: number) {
    let result = { isSuccess: true, affected: 0 };
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const update = await queryRunner.manager.update(Device, { id, userId }, { userId: null });
      result.affected = update.affected || 0;
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      result.isSuccess = false;
    } finally {
      await queryRunner.release();
      return result;
    }
  }

  async deviceControl(data: DeviceControlDto) {
    const resultArr = [];

    const { deviceId: id, userId, payload } = data;
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const targetDevice = await queryRunner.manager.count(Device, { where: { id, userId } });

      if (targetDevice === 1) {
        const configs = Object.keys(payload);

        for (const config of configs) {
          await queryRunner.manager.upsert(DeviceConfig, [{ deviceId: id, command: config, value: payload[config] }], ['deviceId', 'command'])
            .then(async () => {
              await queryRunner.manager.update(Device, id, { [config]: 99 });
              resultArr.push(config);
            }).catch(e => { });
        }
      }
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
      return resultArr;
    }
  }


  // // 디바이스 더미 데이터 생성
  // /*
  //   * * * * * *
  //   | | | | | |
  //   | | | | | day of week
  //   | | | | months
  //   | | | day of month
  //   | | hours
  //   | minutes
  //   seconds (optional)
  // */
  // /* Every 10 minutes */
  // @Cron('0 */10 * * * *')
  // async create() {
  //   const queryRunner = this.connection.createQueryRunner();

  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();

  //   try {
  //     const devices = await queryRunner.manager.find(Device);

  //     for (let i = 0; i < devices.length; i++) {
  //       const create = await queryRunner.manager.create(DeviceStatus, {
  //         deviceId: devices[i].id,
  //         particulate_matter: getRandom(1, 100),
  //         temperature: getRandom(0, 100),
  //         humidity: getRandom(0, 100),
  //         bio_aerosol: getRandom(0, 100),
  //         air_quality: getRandom(0, 100),
  //         food_poisoning: getRandom(0, 100),
  //         hydrogen_sulfide: getRandom(1, 1000),
  //         ammonia: getRandom(1, 1000),
  //         voc: getRandom(1, 1000),
  //         co2: getRandom(1, 5000)
  //       });
  //       await queryRunner.manager.save(create);
  //     }

  //     await queryRunner.commitTransaction();
  //   } catch (e) {
  //     await queryRunner.rollbackTransaction();
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }

  // // 디바이스 명령 처리
  // /* Every 5 seconds */
  // @Cron('*/5 * * * * *')
  // async confirmConfigs() {
  //   const queryRunner = this.connection.createQueryRunner();

  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();

  //   try {
  //     const commands = await queryRunner.manager.find(DeviceConfig, { where: { deletedAt: IsNull() } });

  //     for (let i = 0; i < commands.length; i++) {
  //       await queryRunner.manager.update(Device, commands[i].deviceId, { [commands[i].command]: commands[i].value });
  //       await queryRunner.manager.delete(DeviceConfig, { deviceId: commands[i].deviceId });
  //     }

  //     await queryRunner.commitTransaction();
  //   } catch (e) {
  //     await queryRunner.rollbackTransaction();
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }

  // // 디바이스 수위 & 약품 업데이트
  // /* Every 5 seconds */
  // @Cron('*/5 * * * * *')
  // async updateWaterAndChemicalLevels() {
  //   const queryRunner = this.connection.createQueryRunner();

  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();

  //   try {
  //     const devices = await queryRunner.manager.find(Device);

  //     for (let i = 0; i < devices.length; i++) {
  //       await queryRunner.manager.update(Device, devices[i].id, {
  //         water_level: getRandom(1, 3),
  //         chemical_level: getRandom(1, 3)
  //       });
  //     }

  //     await queryRunner.commitTransaction();
  //   } catch (e) {
  //     await queryRunner.rollbackTransaction();
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }
}
