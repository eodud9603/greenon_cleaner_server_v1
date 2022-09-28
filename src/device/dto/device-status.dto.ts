import { ApiProperty } from "@nestjs/swagger"
import { IsNumber } from "class-validator"

export class DeviceStatusDto {
   @IsNumber()
   @ApiProperty({ description: '온도', minimum: -40, maximum: 85 })
   temperature: number // 온도
   @IsNumber()
   @ApiProperty({ description: '습도', minimum: 0, maximum: 99 })
   humidity: number // 습도
   @IsNumber()
   @ApiProperty({ description: '미세먼지', minimum: 0, maximum: 1000 })
   pm25: number // 미세먼지
   @IsNumber()
   @ApiProperty({ description: '휘발성 유기화합물', minimum: 0, maximum: 3 })
   voc: number//voc
   @IsNumber()
   @ApiProperty({ description: '이산화 탄소', minimum: 0, maximum: 5000 })
   co2: number
   @IsNumber()
   @ApiProperty({ description: '바이오에어로졸', minimum: 0, maximum: 3 })
   cibai: number // 바이오 에어로졸
}
