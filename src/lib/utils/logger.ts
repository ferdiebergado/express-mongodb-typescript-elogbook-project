/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable node/no-unsupported-features/es-syntax */
import fs from 'fs';
import path from 'path';

const file = path.resolve(process.cwd(), 'app.log');
const stream = fs.createWriteStream(file);

const log = (msg: string): void => {
  stream.write(msg);
}

export default (level: string, msg: string): void => {
  log(level + msg);
}
