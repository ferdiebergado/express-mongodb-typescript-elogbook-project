/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable node/no-missing-import */
/* eslint-disable node/file-extension-in-import */
/* eslint-disable node/no-unsupported-features/es-syntax */
import { makeRepository } from '../db'
import { buildMakeAuthService } from './service'

const authRepository = makeRepository('users')

export const makeUserService = buildMakeAuthService(authRepository)
