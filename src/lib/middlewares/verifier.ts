/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable node/no-missing-import */
/* eslint-disable node/file-extension-in-import */
/* eslint-disable node/no-unsupported-features/es-syntax */
import {NextFunction, Request, Response} from "express";
import {verifyToken} from "../utils/jwt";

export default (req: Request, res: Response, next: NextFunction): void => {
  try {
    const payload = verifyToken(req.params.token);
    res.locals.jwtPayload = payload
    next();
  } catch (error) {
    next(error)
  }
};
