/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable node/no-missing-import */
/* eslint-disable node/file-extension-in-import */
/* eslint-disable node/no-unsupported-features/es-syntax */

import messages from '../../config/messages'

export class HttpException extends Error {
  constructor(public statusCode: number, public message: string) {
    super(message)
  }
}

export class NotFoundException extends HttpException {
  constructor(public message: string = messages.notFound) {
    super(404, messages.notFound)
  }
}

export class BadRequestException extends HttpException {
  constructor(public readonly errorBag: Record<string, unknown>) {
    super(400, messages.invalidInput)
  }
}

export class UnprocessableEntityException extends HttpException {
  constructor(public message: string = messages.unprocessableEntity) {
    super(422, message)
  }
}

export class UnauthorizedException extends HttpException {
  constructor(public message: string = messages.unauthorized) {
    super(401, message)
  }
}

export class ForbiddenException extends HttpException {
  constructor(public message: string = messages.forbidden) {
    super(403, message)
  }
}

export class UserAlreadyExistsException extends HttpException {
  constructor() {
    super(422, messages.userExists)
  }
}

export class UserNotFoundException extends HttpException {
  constructor() {
    super(400, messages.invalidUser)
  }
}
