/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable node/no-missing-import */
/* eslint-disable node/file-extension-in-import */
/* eslint-disable node/no-unsupported-features/es-syntax */
import {Entity} from "../../lib/types";

export class Document extends Entity {
  documentType: string;
  details: string;
  personsConcerned: Array<string>;
  remarks?: string;
  officeId: string;
}
