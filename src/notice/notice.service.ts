import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Notice } from './entities/notice.entity';

@Injectable()
export class NoticeService {
  constructor(
    private connection: Connection,

    @InjectRepository(Notice)
    private readonly noticeRepo: Repository<Notice>,
  ) {}

  getAll() {
    return this.noticeRepo.find();
  }

  getOne(id: number) {
    return this.noticeRepo.findOne({ where: { id } });
  }

  // async

  /* create(createNoticeDto: CreateNoticeDto) {
    return 'This action adds a new notice';
  }

  findAll() {
    return `This action returns all notice`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notice`;
  }

  update(id: number, updateNoticeDto: UpdateNoticeDto) {
    return `This action updates a #${id} notice`;
  }

  remove(id: number) {
    return `This action removes a #${id} notice`;
  } */
}
