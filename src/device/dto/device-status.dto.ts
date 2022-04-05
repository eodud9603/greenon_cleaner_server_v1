import { ApiProperty } from "@nestjs/swagger"
import { IsNumber } from "class-validator"

export class DeviceStatusDto {
   @IsNumber()
   @ApiProperty({ description: '미세먼지', minimum: 1, maximum: 100 })
   particulate_matter: number // 미세먼지
   @IsNumber()
   @ApiProperty({ description: '온도', minimum: 0, maximum: 100 })
   temperature: number // 온도
   @IsNumber()
   @ApiProperty({ description: '습도', minimum: 0, maximum: 100 })
   humidity: number // 습도
   @IsNumber()
   @ApiProperty({ description: '바이오 에어로졸', minimum: 1, maximum: 350 })
   bio_aerosol: number // 바이오 에어로졸
   @IsNumber()
   @ApiProperty({ description: '공기질' })
   air_quality: number // 공기질
   @IsNumber()
   @ApiProperty({ description: '식중독 지수' })
   food_poisoning: number // 식중독 지수
   @IsNumber()
   @ApiProperty({ description: '황화 수소', minimum: 1, maximum: 1000 })
   hydrogen_sulfide: number
   @IsNumber()
   @ApiProperty({ description: '암모니아', minimum: 1, maximum: 1000 })
   ammonia: number
   @IsNumber()
   @ApiProperty({ description: '휘발성 유기화합물', minimum: 1, maximum: 1000 })
   voc: number
   @IsNumber()
   @ApiProperty({ description: '이산화 탄소', minimum: 1, maximum: 1000 })
   co2: number
}