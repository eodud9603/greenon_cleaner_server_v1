import { Controller, Get, Post, Body, Param, Req, Patch, HttpCode } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { verifyPasswrodDto } from './dto/verify-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  signin (@Body() body:SignInDto) {
    return this.authService.signin(body);
  }

  @Post('signin/kakao')
  signinWithKakao (@Body() body:{ id:string }) {
    return this.authService.signinWithKakao(body.id);
  }

  @Post('signup')
  signup (@Body() body:SignUpDto) {
    return this.authService.signup(body);
  }

  @Patch(':userId/update')
  updateUserInfo (@Body() body:UpdateAuthDto, @Param('userId') userId:number) {
    return this.authService.updateUserInfo(userId, body);
  }
  @Post(':userId/verify-password')
  @HttpCode(200)
  verifyPasswrod (@Body() body:verifyPasswrodDto, @Param('userId') userId:number) {
    return this.authService.verifyPassword(userId, body.password);
  }

  @Post('signup/kakao')
  signupWithKakao (@Body() body:{ id:string, email:string|null, nickname:string }) {
    return this.authService.signupWithKakao(body);
  }

  @Post('sms/send-code')
  sendSmsCode (@Req() req:Request, @Body () body:{ phone:string }) {
    return this.authService.sendSmsCode(body.phone, req);
  }
  @Post('sms/verify-code')
  verifySmsCode (@Body () body:{ phone:string, code:string }) {
    return this.authService.verifySmsCode(body.phone, body.code);
  }

  @Post('/find-email')
  findEmail (@Body () body:{ phone:string }) {
    return this.authService.findEmail(body.phone);
  }
  // 비밀번호 찾기: sms 인증 이후 이메일 있는지만 확인
  @Post('/change-password')
  changePassword (@Body () body:{ email:string, phone:string, password:string }) {
    return this.authService.changePassword(body.email, body.phone, body.password);
  }
}