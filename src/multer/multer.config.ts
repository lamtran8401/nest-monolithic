import { diskStorage } from 'multer';
import { MulterConfig } from './multer-config.interface';

export const multerConfig: MulterConfig = {
  storage: diskStorage({
    destination: './public',
    filename: (req, file, cb) => {
      const suffix = file.originalname.split('.').pop();
      cb(null, `${file.fieldname}-${Date.now()}.${suffix}`);
    },
  }),
};
