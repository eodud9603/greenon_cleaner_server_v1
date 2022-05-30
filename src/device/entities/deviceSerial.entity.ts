import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DeviceSerial {
  @PrimaryGeneratedColumn('uuid') serial: string;
}
