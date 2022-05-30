import { INestApplication } from "@nestjs/common"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

const setupSwagger = (app:INestApplication) => {
   const options = new DocumentBuilder()
      .setTitle('GREENON MIDDLEWARE')
      .setDescription('그린온 미들웨어 API')
      .setVersion('1.0')
      .build();

   const document = SwaggerModule.createDocument(app, options);
   SwaggerModule.setup('api-docs', app, document);
}

export default setupSwagger;