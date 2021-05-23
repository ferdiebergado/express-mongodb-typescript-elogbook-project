/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable node/no-missing-import */
/* eslint-disable node/file-extension-in-import */
/* eslint-disable node/no-unsupported-features/es-syntax */
import {Request, Response, NextFunction} from "express";
import asyncHandler from "./asyncHandler";

export default asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // TODO: provide default values for ip and userAgent
  const {body, socket, headers} = req
  res.locals.clientData = Object.freeze({
    formData: body, ip: socket.remoteAddress, userAgent: headers['user-agent']
  })
  next();
});
