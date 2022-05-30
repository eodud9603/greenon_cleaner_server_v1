import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Device } from "./device.entity";

@Entity()
export class DeviceStatus {
  @PrimaryColumn()
  deviceId: string;
  @CreateDateColumn()
  @PrimaryColumn({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column()
  particulate_matter: number; // 미세먼지
  @Column()
  temperature: number; // 온도
  @Column()
  humidity: number; // 습도
  @Column()
  bio_aerosol: number; // 바이오에어로졸
  @Column()
  air_quality: number; // 공기질
  @Column()
  food_poisoning: number; // 식중독 지수

  @Column()
  hydrogen_sulfide: number;
  @Column()
  ammonia: number;
  @Column()
  voc: number;
  @Column()
  co2: number;

  @ManyToOne(() => Device, device => device.status, { onUpdate: 'CASCADE' , onDelete: 'CASCADE' })
  @JoinColumn({ name: 'deviceId' })
  device: Device
}
