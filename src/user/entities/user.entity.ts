import { Device } from 'src/device/entities/device.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn() id: number;
  @Column({ default: false }) isAdmin: boolean;

  @Column({ unique: true, default: null }) email: string;
  @Column({ nullable: true }) name: string;
  @Column({ nullable: true, default: null }) password: string;
  @Column({ nullable: true, default: null }) phone: string;

  @Column({ default: null, unique: true }) kakaoId: string;

  @OneToMany(() => Device, (device) => device.owner)
  devices: Device[];
}
