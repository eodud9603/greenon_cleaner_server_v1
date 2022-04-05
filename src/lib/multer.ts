import { HttpException } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';

export const multerDiskOptions = {
   fileFilter: (request, file, callback) => {
      if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
         // 이미지 형식은 jpg, jpeg, png만 허용합니다.
         callback(null, true);
      } else {
         callback(new HttpException('지원하지 않는 이미지 형식입니다.', 400), false);
      }
   },

   storage: diskStorage({
      destination: (request, file, callback) => {
         const uploadPath: string = 'static';

         if (!existsSync(uploadPath)) {
            // static 폴더가 존재하지 않을시, 생성합니다.
            mkdirSync(uploadPath);
         }

         callback(null, uploadPath);
      },

      filename: (request, file, callback) => {
         callback(null, `${uuid()}${extname(file.originalname)}`);
      }
   })
};