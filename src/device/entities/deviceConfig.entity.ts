import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { Device } from "./device.entity";

@Entity()
export class DeviceConfig {
   @PrimaryColumn()
   deviceId: string;
   @PrimaryColumn()
   command: string; // 명령
   /* 
      명령 타입
      power
      mode
      mode_time
      is_working
      rm_area_bacteria
      pest_control
   */
   @Column()
   value: number;

   @UpdateDateColumn()
   createdAt: Date;

   @DeleteDateColumn()
   deletedAt: Date;

   @ManyToOne(() => Device, device => device.configs, { onUpdate: 'CASCADE' , onDelete: 'CASCADE' })
   @JoinColumn({ name: 'deviceId' })
   device: Device
}