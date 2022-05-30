import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
// .env 설정이 포함되어있으므로 import 순서 지킬 것
import { ConfigurationModule } from './modules/configuration.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './modules/database.module';
import { ScheduleModule } from '@nestjs/schedule';
// import { ExampleMiddleware } from './middlewares/example.middleware';
import { DeviceModule } from './device/device.module';
import { AdminModule } from './admin/admin.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { NoticeModule } from './notice/notice.module';
import { RequestModule } from './request/request.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import path, { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
    }),
    ConfigurationModule,
    DatabaseModule,
    ScheduleModule.forRoot(),
    DeviceModule,
    AdminModule,
    UserModule,
    AuthModule,
    NoticeModule,
    RequestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(ExampleMiddleware).forRoutes('/');
  }
}
