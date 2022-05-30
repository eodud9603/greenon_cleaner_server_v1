import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Request {
  @PrimaryGeneratedColumn() id: number;

  @Column() userId: number;
  @Column({ nullable: false })
  username: string;

  @Column({ nullable: false })
  phone: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  content: string;

  @Column({ nullable: true })
  image: string;

  @CreateDateColumn()
  createdAt: Date;
}
