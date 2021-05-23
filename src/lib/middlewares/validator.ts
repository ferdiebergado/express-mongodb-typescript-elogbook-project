/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable node/file-extension-in-import */
/* eslint-disable node/no-missing-import */
/* eslint-disable node/no-unsupported-features/es-syntax */
import { Request, Response, NextFunction } from "express";
import Joi, { ValidationOptions } from "joi";
import { BadRequestException } from "../exceptions/http";
import { HttpFunction } from "../types";
import asyncHandler from "./asyncHandler";

export default (schema: Joi.Schema): HttpFunction => {
  return asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const validationOptions: ValidationOptions = {
          abortEarly: false,
          stripUnknown: true,
        };
        res.locals.validated = await schema
          .options(validationOptions)
          .validateAsync(req.body);
        next();
      } catch (e) {
        throw new BadRequestException(e);
      }
    }
  );
};
