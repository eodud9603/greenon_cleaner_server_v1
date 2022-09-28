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
   temperature: number; // 온도
   @Column()
   humidity: number; // 습도
   @Column()
   pm25: number; // 미세먼지
   @Column()
   voc: number;
   @Column()
   co2: number;
   @Column()
   cibai: number; // 바이오에어로졸

   @ManyToOne(() => Device, device => device.status, { onUpdate: 'CASCADE' , onDelete: 'CASCADE' })
   @JoinColumn({ name: 'deviceId' })
   device: Device
}
