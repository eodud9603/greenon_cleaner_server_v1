import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Notice {
  @PrimaryGeneratedColumn() id: number;
  @Column() title: string;
  @Column({ type: 'text' }) content: string;
  @Column({ default: null }) imgUri: string;
  @Column({ default: 0 }) viewCount: number;
  @CreateDateColumn() createdAt: Date;
}
