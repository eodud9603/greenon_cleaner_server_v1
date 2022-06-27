import { Controller, Get, Post, Body, Param, Patch, Query, HttpCode } from '@nestjs/common';
import { DeviceService } from './device.service';
import { SyncDeviceDto } from './dto/sync-device.dto';
import { ReportDeviceConfigDto } from './dto/report-device-config.dto';
import { ReportDeviceStatusDto } from './dto/report-device-status.dto';
import { ReportDeviceSyncDto } from './dto/report-device-sync.dto';
import { ApiExtraModels, ApiOperation, ApiProperty, ApiResponse, ApiTags, getSchemaPath, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { DeviceControlDto } from './dto/device-control.dto';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { DeviceConfigDto } from './dto/device-config.dto';

class PostResultDto {
  @IsBoolean()
  @ApiProperty({ description: '결과값 (적용된 행이 있다면 true)' })
  result: boolean;
};

@Controller('device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  // // 1. 디바이스 초기화
  // @ApiTags('펌웨어 → 미들웨어 요청')
  // @Post('init')
  // @ApiOperation({ summary: '1. 디바이스 동기화', description: `디바이스 신규 등록 또는 디바이스 명령 상태 업데이트.<br/>펌웨어(기기) 최초 가동 또는 재시작 시 1회만 요청할 것.<br/>주기적인 업데이트는 /device/report-configs 사용` })
  // @HttpCode(200)
  // @ApiResponse({ status: 200, type: PostResultDto })
  // /* @ApiResponse({
  //   status: 200,
  //   content: {
  //     'application/json': {
  //       schema: {
  //         type: 'object',
  //         required: ['result'],
  //         properties: {
  //           result: {
  //             type: 'boolean',
  //             example: true,
  //           }
  //         }
  //       }
  //     }
  //   }
  // }) */
  // init (@Body() data:SyncDeviceDto) {
  //   return this.deviceService.init(data);
  // }

  // 2. 디바이스 명령 상태 동기화 (5초)
  @ApiTags('펌웨어 → 미들웨어 요청')
  @Post('report-configs')
  @HttpCode(200)
  @ApiOperation({ summary: '1. 디바이스 명령 상태 동기화 (5초) - (전원, 모드 등)', description: '현재 디바이스의 명령 상태 (전원, 모드 등) 보고' })
  @ApiResponse({ status: 200, type: PostResultDto })
  reportConfigs (@Body() data:ReportDeviceConfigDto) {
    return this.deviceService.reportConfigs(data);
  }

  // 3. 수위/약품 상태 동기화 (5초)
  // @Patch('report-water-chemical-level')
  // reportWaterAndChemicalLevel (@Body() data:ReportDeviceWaterChemicalLevelDto) {
  //   return data;
  // }

  // 4. 디바이스 가동 상태 (미세먼지, 온도, 습도 등) (10분)
  @ApiTags('펌웨어 → 미들웨어 요청')
  @Post('report-status')
  @HttpCode(200)
  @ApiResponse({ status: 200, type: PostResultDto })
  @ApiOperation({ summary: '2. 디바이스 가동 상태 동기화 (10분) - (미세먼지, 온도, 습도 등)', description: '현재 디바이스의 가동 상태 (미세먼지, 온도, 습도 등) 보고' })
  reportStatus (@Body() data:ReportDeviceStatusDto) {
    return this.deviceService.reportStatus(data);
  }

  // 5. 디바이스 연결 상태 (5초)
  @ApiTags('펌웨어 → 미들웨어 요청')
  @Patch('report-sync')
  @HttpCode(200)
  @ApiResponse({ status: 200, type: PostResultDto })
  @ApiOperation({ summary: '3. 디바이스 연결 상태 동기화 (5초) - (optional)', description: '디바이스 현재 연결 상태를 주기적으로 보고.<br/>[2. 디바이스 명령 상태 동기화] api가 주기적으로 연결상태를 업데이트하기 때문에 사용 안해도 무관.' })
  reportSync (@Body() data:ReportDeviceSyncDto) {
    return this.deviceService.reportSync(data);
  }

  // 6. 미들웨어에서 명령 받아오기 (5초)
  @ApiTags('펌웨어 → 미들웨어 요청')
  @Get(':deviceId/configs')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    type: PartialType(OmitType(DeviceConfigDto, ['water_level'])),
    isArray: true,
    description: '해당 펌웨어에 전달되는 명령을 { [명령타겟]: 값 } 배열 형태로 전달.<br/>주의: 배열 하나의 요소에 모든 명령이 들어가는 것이 아니라<br/>명령 하나 당 배열 요소 하나로 나열됨<br/>ex: [ { "power": 1 }, { "mode": 2 } ]<br/><br/>*변경이 된 데이터만 전달됨.',
  })
  @ApiOperation({ summary: '4. 미들웨어에서 명령 받아오기 (5초)', description: '해당 디바이스에 전달된 제어 명령 목록을 받아옴.' })
  getConfigs (@Param('deviceId') deviceId:string) {
    return this.deviceService.getConfigs(deviceId);
  }

  /* app */
  // 시리얼번호 검증
  @ApiTags('프론트(앱) → 시리얼번호 조회')
  @Post('verify-serial')
  verifySerial (@Body('serial') serial:string) {
    return this.deviceService.verifySerial(serial);
  }

  /* temp: 임시 시리얼번호 등록 */
  // @Post('bulk')
  // bulkInsert () {
  //   return this.deviceService.bulkInsert();
  // }

  /* front */

  // 유저 디바이스 불러오기
  @ApiTags('프론트(관리자) → 미들웨어 요청 (유저별 데이터)')
  @Get('user-device')
  getUserDevices (@Query('userId') userId:number) {
    return this.deviceService.getUserDevices(userId);
  }

  // 유저 디바이스 등록
  @ApiTags('프론트(관리자) → 미들웨어 요청 (유저별 데이터)')
  @Post('user-device/register')
  registerUserDevice (@Body() data: { id:string, userId:number }) {
    return this.deviceService.registerUserDevice(data.id, data.userId);
  }

  @ApiTags('프론트(관리자) → 미들웨어 요청 (유저별 데이터)')
  @Patch(':deviceId/update')
  updateUserDevice (@Body() body:{ name:string }, @Param('deviceId') deviceId:string) {
    return this.deviceService.updateUserDevice(deviceId,body.name);
  }

  @ApiTags('프론트(관리자) → 미들웨어 요청 (유저별 데이터)')
  @Post('user-device/unregister')
  unregisterUserDevice (@Body() data: { id:string, userId:number }) {
    return this.deviceService.unregisterUserDevice(data.id, data.userId);
  }

  // 디바이스 목록 최신 상태
  @ApiTags('프론트(관리자) → 미들웨어 요청 (유저별 데이터)')
  @Get('user-device/current-status')
  getUserDevicesCurrentStatus (@Query('userId') userId:number) {
    return this.deviceService.getUserDevicesCurrentStatus(userId);
  }

  // 디바이스 가동 상태
  @ApiTags('프론트(관리자) → 미들웨어 요청 (유저별 데이터)')
  @Get('user-device/current-configs')
  getUserDeviceConfigs (@Query('userId') userId:number) {
    return this.deviceService.getUserDeviceConfigs(userId);
  }

  // 디바이스 제어
  @ApiTags('프론트(관리자) → 미들웨어 요청 (유저별 데이터)')
  @Post('user-device/config')
  deviceControl (@Body() data:DeviceControlDto) {
    return this.deviceService.deviceControl(data);
  }

  // 디바이스 로그
  @ApiTags('프론트(관리자) → 미들웨어 요청 (유저별 데이터)')
  @Get('user-device/:deviceId/status')
  getUserDeviceStatus (@Param('deviceId') id:string, @Query('userId') userId:number) {
    return this.deviceService.getUserDeviceStatus(id, userId);
  }

  // 디바이스 누적데이터
  @ApiTags('프론트(관리자) → 미들웨어 요청 (유저별 데이터)')
  @Get('user-device/:deviceId/data')
  getCumulativeData (@Param('deviceId') id:string, @Query('type') type:string) {
    console.log('aa :: ',id);
    return this.deviceService.getCumulativeData(id,type);
  }
}
