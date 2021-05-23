/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable node/no-unsupported-features/es-syntax */
import {readFileSync} from "fs";
import path from 'path';

export default (() => {
  try {
    const file = path.resolve(process.cwd(), '.env');
    const data = readFileSync(file, 'utf-8');
    const lines = data.split('\n');
    lines.forEach(line => {
      if (line && line.charAt(0) !== '#') {
        const index = line.indexOf('=');
        const key = line.substr(0, index);
        const val = line.substr(index + 1);
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    });
  } catch (e) {
    console.error(e)
  }
})();
