import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { Request } from './entities/request.entity';

@Injectable()
export class RequestService {
  constructor (
    private connection: Connection,
    @InjectRepository(Request)
    private readonly requestRepo: Repository<Request>,
  ) {}

  async create(data: {
    username: string;
    phone: string;
    email: string;
    title: string;
    content: string;
    image?: string;
  }) {
    let result = true;
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const insertData = await queryRunner.manager.create(Request, data);

      await queryRunner.manager.save(insertData);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      console.log(e);
      result = false;
    } finally {
      await queryRunner.release();
      return { result };
    }
  }

  findAll() {
    return `This action returns all request`;
  }

  findOne(id: number) {
    return `This action returns a #${id} request`;
  }

  update(id: number, updateRequestDto: UpdateRequestDto) {
    return `This action updates a #${id} request`;
  }

  remove(id: number) {
    return `This action removes a #${id} request`;
  }
}
