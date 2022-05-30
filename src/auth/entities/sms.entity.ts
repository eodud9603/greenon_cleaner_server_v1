import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Sms {
   @PrimaryGeneratedColumn('uuid') phone: string;

   @Column() code: string;

   @Column({ type: 'datetime' }) expireAt: Date
}