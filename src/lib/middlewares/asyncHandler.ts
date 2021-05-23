/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable node/file-extension-in-import */
/* eslint-disable node/no-missing-import */
/* eslint-disable node/no-unsupported-features/es-syntax */
import { Request, Response, NextFunction } from "express";
import { AsyncHttpFunction } from "../types";

export default (f: AsyncHttpFunction) => (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  f(req, res, next).catch(next);
};
