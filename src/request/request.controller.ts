import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  Bind,
} from '@nestjs/common';
import { RequestService } from './request.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { multerDiskOptions } from 'src/lib/multer';

interface File extends Blob {
  readonly lastModified: number;
  readonly filename: string;
}

@Controller('request')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', multerDiskOptions))
  @Bind(UploadedFile())
  create(
    @UploadedFile() file: File,
    @Body()
    data: {
      username: string;
      phone: string;
      email: string;
      title: string;
      content: string;
    },
  ) {
    return this.requestService.create({
      ...data,
      ...(file && { image: file.filename }),
    });
  }

  /* @Post()
  create(@Body() createRequestDto: CreateRequestDto) {
    return this.requestService.create(createRequestDto);
  }

  @Get()
  findAll() {
    return this.requestService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requestService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRequestDto: UpdateRequestDto) {
    return this.requestService.update(+id, updateRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.requestService.remove(+id);
  } */
}
