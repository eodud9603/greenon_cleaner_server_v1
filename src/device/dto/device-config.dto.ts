import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class DeviceConfigDto {
   @IsNumber()
   @ApiProperty({ description: '전원 (off=0, on=1)', minimum: 0, maximum: 1 })
   power: number;

   @IsNumber()
   @ApiProperty({ description: '모드 (제균=1, 해충=2)', minimum: 1, maximum: 2 })
   mode: number;

   @IsNumber()
   @ApiProperty({ description: '시간 (수동=-1, 연속=0, 1시간=1, 2시간=2)', minimum: 0, maximum: 2 })
   mode_time: number;

   @IsNumber()
   @ApiProperty({ description: '가동 상태 (stop=0, start=1)', minimum: 0, maximum: 1 })
   is_working: number;

   // @IsNumber()
   // @ApiProperty({ description: '공간제균 (수동=-1, 연속=0, 1시간=1, 2시간=2)', minimum: -1, maximum: 2 })
   // rm_area_bacteria: number;

   // @IsNumber()
   // @ApiProperty({ description: '해충방제 (수동=-1, 연속=0, 1시간=1, 2시간=2)', minimum: -1, maximum: 2 })
   // pest_control: number;

   @IsNumber()
   @ApiProperty({ description: '수위 (낮음=1, 보통=2, 높음=3)', minimum: 1, maximum: 3 })
   water_level: number;

   @IsNumber()
   @ApiProperty({ description: '약품 (낮음=1, 보통=2, 높음=3)', minimum: 1, maximum: 3 })
   chemical_level: number;
}