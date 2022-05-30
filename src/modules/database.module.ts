import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

const typeorm = TypeOrmModule.forRoot({
   type: 'mysql',
   host: process.env.DATABASE_HOST,
   port: parseInt(process.env.DATABASE_PORT) || 3306,
   username: process.env.DATABASE_USERNAME,
   password: process.env.DATABASE_PASSWORD,
   database: process.env.DATABASE_DB,
   autoLoadEntities: true,
   synchronize: true // for development. Better run `yarn typeorm schema:sync`
});

@Module({
   imports: [typeorm]
})
export class DatabaseModule {};
