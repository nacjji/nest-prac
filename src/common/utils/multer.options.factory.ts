import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import * as fs from 'fs';
import * as multer from 'multer';
import * as path from 'path';

const mkdir = (directory: string) => {
  try {
    fs.readdirSync(path.join(process.cwd(), directory));
  } catch (err) {
    console.log(
      `지정한 경로에 ${directory}가 존재하지 않아 ${directory}를 생성합니다.`,
    );

    fs.mkdirSync(path.join(process.cwd(), directory));
  }
};

mkdir('uploads');

export const multerOptionsFactory = (): MulterOptions => {
  return {
    storage: multer.diskStorage({
      destination(req, file, done) {
        // 파일을 저장할 위치를 설정합니다
        done(null, path.join(process.cwd(), 'uploads'));
      },

      filename(req, file, done) {
        // 파일의 이름을 설정합니다.
        const ext = path.extname(file.originalname); // 파일 확장자 추출
        const basename = path.basename(file.originalname, ext); // 파일 이름
        // 파일 이름이 중복되는 것을 막기 위해 '파일이름_날짜.확장자' 의 형식으로 파일이름을 지정합니다.
        done(null, `${basename}_${Date.now()}${ext}`);
      },
    }),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB로 크기를 제한
  };
};
