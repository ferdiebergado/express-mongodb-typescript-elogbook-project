/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable node/file-extension-in-import */
/* eslint-disable node/no-missing-import */
/* eslint-disable node/no-unsupported-features/es-syntax */

import { messages } from '../../config'
import { ValidationErrors } from '../types'

export class InputValidationException extends Error {
  constructor(public readonly validationErrorBag: ValidationErrors) {
    super(messages.invalidInput)
  }
}
