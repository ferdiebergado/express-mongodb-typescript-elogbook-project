/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable node/no-missing-import */
/* eslint-disable node/file-extension-in-import */
/* eslint-disable node/no-unsupported-features/es-syntax */
import {Request, Response, NextFunction} from "express";
import {NotFoundException} from "../exceptions/http";

export default (_req: Request, _res: Response, next: NextFunction): void => {
  next(new NotFoundException());
}
