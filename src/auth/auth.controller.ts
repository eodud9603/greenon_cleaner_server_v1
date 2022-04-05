import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

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
}