import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { User } from 'src/user/entities/user.entity';
import { Connection, Repository } from 'typeorm';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { Sms } from './entities/sms.entity';
import * as FormData from 'form-data';
import aligoapi from 'aligoapi';
import { Request } from 'express';
import * as qs from 'qs';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private connection: Connection,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) { }

  async signin (data:SignInDto) {
    console.log(123123);
    const user = await this.userRepo.findOne({
      where: { ...data },
      select: ['id', 'isAdmin', 'name', 'email', 'phone']
    });
    
    return { user };
  }

  async signinWithKakao (kakaoId:string) {
    const user = await this.userRepo.findOne({
      where: { kakaoId },
      select: ['id', 'isAdmin', 'name', 'email', 'phone']
    });
    
    return { user };
  }

  async signup (data:SignUpDto) {
    let isSuccess = true;
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const insertData = await queryRunner.manager.create(User, { email: data.email, password: data.password, phone: null });

      await queryRunner.manager.save(insertData);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      isSuccess = false;
    } finally {
      await queryRunner.release();
      return isSuccess;
    }
  }

  async signupWithKakao (data:{ id:string, email:string, nickname:string }) {
    let isSuccess = true;
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const insertData = await queryRunner.manager.create(User, { email: data.email, kakaoId: data.id, name: data.nickname });

      await queryRunner.manager.save(insertData);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      isSuccess = false;
    } finally {
      await queryRunner.release();
      return isSuccess;
    }
  }

  async updateUserInfo (userId:number, payload:UpdateAuthDto) {
    let result = { isSuccess: true, affected: 0 };
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const update = await queryRunner.manager.update(User, { id: userId }, payload);
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

  async verifyPassword (userId:number, password:string) {
    const verified = await this.userRepo.count({ password, id: userId });
    return { result: !!verified };
  }

  async sendSmsCode (phone:string, req:Request) {
    let result = true;

    // Generate Random Code
    let verifyCode = "";
    for (let i = 0; i < 6; i++) {
      verifyCode += parseInt((Math.random() * 10).toString()).toString();
    }

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.upsert(Sms, [{ phone, code: verifyCode, expireAt: new Date(Date.now() + (3 * 60000)) }], ['phone']);

      /* req.body = {
        sender: process.env.SMS_SENDER,
        receiver: phone,
        msg_type: "SMS",
        msg: `[그린온] SMS 인증번호 [${verifyCode}]`,
      };

      await aligoapi.send(req, {
        key: process.env.SMS_API_KEY,
        user_id: process.env.SMS_USER_ID,
      }).then(res => console.log(res)); */

      // const fd = new FormData();

      // fd.append('key', process.env.SMS_API_KEY);
      // fd.append('sender', process.env.SMS_SENDER);
      // fd.append('user_id', process.env.SMS_USER_ID);
      // fd.append('receiver', phone);
      // fd.append('msg_type', "SMS");
      // fd.append('msg', `[그린온] SMS 인증번호 [${verifyCode}]`);

      await axios({
        url: 'https://apis.aligo.in/send/',
        headers: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        method: 'POST',
        data: qs.stringify({
          key: process.env.SMS_API_KEY,
          sender: process.env.SMS_SENDER,
          user_id: process.env.SMS_USER_ID,
          receiver: phone,
          msg_type: "SMS",
          msg: `[그린온] SMS 인증번호 [${verifyCode}]`,
        })
      }).then(res => console.log(res));
      
      await queryRunner.commitTransaction();
    } catch (e) {
      result = false;
      console.log(e);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
      return { result };
    }
  }

  async verifySmsCode (phone:string, code:string) {
    const result = {
      affected: 0
    };
    let isSuccess = true;
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const deleted = await queryRunner.manager.delete(Sms, { phone, code });
      result.affected = deleted.affected;
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
      return result;
    }
  }

  async findEmail (phone:string) {
    const result = await this.userRepo.find({ where: { phone }, select: ['email'] });
    return result.map(r => r.email);
  }

  async changePassword (email:string, phone:string, password:string) {
    let result = { isSuccess: true, affected: 0 };
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const update = await queryRunner.manager.update(User, { email, phone }, { password });
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
}
