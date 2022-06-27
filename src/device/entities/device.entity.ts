import { User } from "src/user/entities/user.entity";
import { AfterUpdate, Column, CreateDateColumn, Entity, JoinColumn, LoadEvent, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn, UpdateEvent } from "typeorm";
import { DeviceConfig } from "./deviceConfig.entity";
import { DeviceStatus } from "./deviceStatus.entity";

@Entity()
export class Device {
   @PrimaryGeneratedColumn('uuid') id: string;

   @Column({ default: null }) userId: number;
   @Column({ default: /* null */'사용자 지정 이름' }) name: string; // 사용자 지정 명칭
   @Column({ default: /* null */'AT-153B' }) serial: string; // 제품번호
   @Column({ default: /* null */'공기청정제균기' }) type: string; // 기기 종류

   // 디바이스 명령 상태
   @Column({ default: 0 }) power: number; // 전원 (1: 켜짐, 0: 꺼짐)
   @Column({ default: 0 }) mode: number; // 제균 동작 선택 (1: 켜짐, 0: 꺼짐)
   @Column({ default: 0 }) mode_time: number; // 제균 시간 선택 (0: 연속, 1, 2)
   @Column({ default: 0 }) air_volume: number; // 풍량선택 (0: 상시, 강: 1, 쾌속: 2)
   @Column({ default: 0 }) air_quality: number; // 공기질 선택 (1: 켜짐, 0: 꺼짐)

   // mode & mode_time 과 중복
   // @Column() rm_area_bacteria: number; // 공간 제균 (-1: 수동, 0: 연속, 1: 1시간, 2: 2시간)
   // @Column() pest_control: number; // 해충 방제 (-1: 수동, 0: 연속, 1: 1시간, 2: 2시간)

   @Column({ default: null }) water_level: number; // 수위


   @CreateDateColumn() createdAt: Date;
   @UpdateDateColumn() updatedAt: Date;

   // 디바이스 가동 상태
   /* @Column({ default: null })
   particulate_matter: number; // 미세먼지
   @Column({ default: null })
   temperature: number; // 온도
   @Column({ default: null })
   humidity: number; // 습도
   @Column({ default: null })
   bio_aerosol: number; // 바이오에어로졸
   @Column({ default: null })
   air_quality: number; // 공기질
   @Column({ default: null })
   food_poisioning: number; // 식중독 지수

   @Column({ default: null })
   hydrogen_sulfide: number;
   @Column({ default: null })
   ammonia: number;
   @Column({ default: null })
   voc: number;
   @Column({ default: null })
   co2: number; */

   @OneToMany(() => DeviceStatus, status => status.device/* , { onUpdate: 'CASCADE', onDelete: 'CASCADE' } */)
   status: DeviceStatus[];

   @OneToMany(() => DeviceConfig, config => config.device/* , { onUpdate: 'CASCADE', onDelete: 'CASCADE' } */)
   configs: DeviceConfig[];

   @ManyToOne(() => User, user => user.devices, { onUpdate: 'CASCADE', onDelete: 'SET NULL' })
   @JoinColumn({ name: 'userId' })
   owner: User;
}
