/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable node/no-missing-import */
/* eslint-disable node/file-extension-in-import */
/* eslint-disable node/no-unsupported-features/es-syntax */
import {NextFunction, Request, Response} from 'express'
import {JsonWebTokenError, NotBeforeError, TokenExpiredError} from 'jsonwebtoken'
import {HttpException, UnauthorizedException} from '../exceptions/http'
import {InputValidationException} from '../exceptions/validation'
import {ErrorResponse} from '../types'

export default (
  err: HttpException,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  let status = 500

  if (err.statusCode) status = err.statusCode

  const response: ErrorResponse = {
    error: {
      message: err.message,
    },
  }

  console.error(err)

  if (err instanceof InputValidationException) {
    status = 400
    response.error.errors = err.validationErrorBag
  }

  if (err instanceof JsonWebTokenError || err instanceof TokenExpiredError || err instanceof NotBeforeError) {
    const exception = new UnauthorizedException()
    status = exception.statusCode
    response.error.message = err.message
  }

  res.status(status).json(response)
}
