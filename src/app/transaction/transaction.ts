/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable node/no-missing-import */
/* eslint-disable node/file-extension-in-import */
/* eslint-disable node/no-unsupported-features/es-syntax */
import {Entity} from "../../lib/types";

enum Tasks {
  IN = 'Incoming',
  OUT = 'Outgoing'
}

export class Transaction extends Entity {
  documentId: string;
  docTypeId: string;
  task: Tasks;
  fromToOfficeId: string;
  documentDate: Date;
  action: string;
  actionToBeTaken: string;
  by: string;
  officeId: string;
  pending: boolean;
  parentId: string;
}
