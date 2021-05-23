/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable node/no-missing-import */
/* eslint-disable node/file-extension-in-import */
/* eslint-disable node/no-unsupported-features/es-syntax */
import {NextFunction, Request, Response} from 'express'
import {UnauthorizedException} from '../exceptions/http'
import {makeRepository} from '../db'
import {verifyToken} from '../utils/jwt'
import asyncHandler from './asyncHandler'
import messages from '../../config/messages'
import {JwtPayload} from '../types'

export default asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const {token} = req.signedCookies
    if (!token) throw new UnauthorizedException(messages.authCredsMissing)

    const payload: JwtPayload = verifyToken(token)
    const userRepository = makeRepository('users')
    const user = await userRepository.findById(payload.sub)
    if (!user) throw new UnauthorizedException(messages.authCredsInvalid)

    res.locals.user = user
    next()
  }
)
