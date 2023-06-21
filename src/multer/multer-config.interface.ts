import { StorageEngine } from 'multer';

export interface MulterConfig {
  dest?: string;
  preservePath?: boolean;
  storage?: StorageEngine;
}
