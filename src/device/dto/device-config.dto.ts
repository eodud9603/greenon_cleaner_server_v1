import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import any = jasmine.any;
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class DeviceConfigDto {
  @IsNumber()
  @ApiProperty({ description: '전원 (off=0, on=1)', minimum: 0, maximum: 1 })
  power: number;

  @IsNumber()
  @ApiProperty({
    description: '모드 (공기질=0, 수동=1, 제균=2)',
    minimum: 0,
    maximum: 2,
  })
  mode: number;

  @IsNumber()
  @ApiProperty({
    description: '시간 (1시간=1, 2시간=2 ,3시간=3)',
    minimum: 1,
    maximum: 3,
  })
  mode_time: number;

  @IsNumber()
  @ApiProperty({
    description: '시간 (취침=0, 상시=1, 강속=2, 쾌속=3)',
    minimum: 0,
    maximum: 2,
  })
  air_volume: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description:
      '수위 (정상=0, 물보충 요청=1) -> 필터 교체 알림 컬럼이므로 옵션인 컬럼(필수 x)',
    minimum: 0,
    maximum: 1,
    required: false,
  })
  water_level: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description:
      '필터 (정상=0, 필터교체 요청=1) -> 필터 교체 알림 컬럼이므로 옵션인 컬럼(필수 x)',
    minimum: 0,
    maximum: 1,
    required: false,
  })
  filter: number;

  // @IsNumber()
  // @ApiProperty({ description: '전원 (off=0, on=1)', minimum: 0, maximum: 1 })
  // power: number;
  //
  // @IsNumber()
  // @ApiProperty({ description: '모드 (off=0, on=1)', minimum: 0, maximum: 1 })
  // mode: number;
  //
  // @IsNumber()
  // @ApiProperty({ description: '시간 (연속=0, 1시간=1, 2시간=2)', minimum: 0, maximum: 2 })
  // mode_time: number;
  //
  // @IsNumber()
  // @ApiProperty({ description: '시간 (상시=0, 강=1, 쾌속=2)', minimum: 0, maximum: 2 })
  // air_volume: number;
  //
  // @IsNumber()
  // @ApiProperty({ description: '가동 상태 (off=0, on=1)', minimum: 0, maximum: 1 })
  // air_quality: number;

  // @IsNumber()
  // @ApiProperty({ description: '공간제균 (수동=-1, 연속=0, 1시간=1, 2시간=2)', minimum: -1, maximum: 2 })
  // rm_area_bacteria: number;

  // @IsNumber()
  // @ApiProperty({ description: '해충방제 (수동=-1, 연속=0, 1시간=1, 2시간=2)', minimum: -1, maximum: 2 })
  // pest_control: number;

  // @IsNumber()
  // @ApiProperty({ description: '수위 (낮음=1, 보통=2, 높음=3)', minimum: 1, maximum: 3 })
  // water_level: number;
}
