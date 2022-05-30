import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AdminService } from './admin.service';
import { AdminDeviceCommandDto } from './dto/admin-device-command.dto';
import { AdminDeviceRegisterDto } from './dto/admin-device-register.dto';

@Controller('admin')
@ApiTags('프론트(관리자) → 미들웨어 요청')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // 1. 제품 등록 (미정)
  @Post('device-register')
  @ApiOperation({ summary: '1. 제품 등록 - (미정)' })
  async registerDevice(
    @Body() data: AdminDeviceRegisterDto,
    @Res() response: Response,
  ) {
    response.json({ result: await this.adminService.registerDevice(data) });
  }

  // 2. 디바이스에 명령 전달
  @Post('device-command')
  @ApiOperation({ summary: '2. 디바이스에 명령 전달' })
  async sendCommand(
    @Body() data: AdminDeviceCommandDto,
    @Res() response: Response,
  ) {
    response.json({ result: await this.adminService.sendCommand(data) });
  }

  // // 3. 디바이스 연결 상태 확인 (15초)
  // @Get('device-connection/:deviceId')
  // getDeviceConnection(@Param('deviceId') deviceId: string) {
  //   this.adminService.getDeviceConnection(deviceId);
  // }

  // 4. 디바이스 가동 상태 (미세먼지, 온도, 습도 등)
  @Get('device-status/:deviceId')
  @ApiOperation({
    summary:
      '3. 디바이스 가동 상태 불러오기 (10분) - (미세먼지, 온도, 습도 등)',
  })
  getDeviceStatus(@Param('deviceId') deviceId: string) {
    return this.adminService.getDeviceStatus(deviceId);
  }

  // // 5. 디바이스 수위/약품 상태 (5초)
  // @Get('device-/:deviceId')
  // getDeviceWaterAndChemicalLevel(@Param('deviceId') deviceId:string) {
  //   this.adminService.getDeviceWaterAndChemicalLevel(deviceId);
  // }

  // 6. 디바이스 구성 상태 (10초)
  @Get('device-configs/:deviceId')
  @ApiOperation({
    summary: '4. 디바이스 명령 상태 불러오기 (10초) - (전원, 모드 등)',
  })
  getDeviceConfigs(@Param('deviceId') deviceId: string) {
    return this.adminService.getDeviceConfigs(deviceId);
  }
}
