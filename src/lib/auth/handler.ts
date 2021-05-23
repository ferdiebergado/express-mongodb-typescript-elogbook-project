/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable node/file-extension-in-import */
/* eslint-disable node/no-missing-import */
/* eslint-disable node/no-unsupported-features/es-syntax */
import { Request, Response } from 'express'
import { asyncHandler } from '../middlewares'
import { messages } from '../../config'
import { makeRepository } from '../db'
import { buildMakeAuthService } from './service'

const authRepository = makeRepository('users')
const makeAuthService = buildMakeAuthService(authRepository)
const authService = makeAuthService()

export const register = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const id = await authService.register(req.body)
    res.status(201).json({ _id: id })
  }
)

export const verify = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const { sub } = res.locals.jwtPayload
    await authService.verify(sub)
    res.json({ message: 'Account verified!' })
  }
)

export const login = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const token = await authService.login(req.body)
    res.cookie('token', token, {
      expires: new Date(Date.now() + 60000 * 30),
      httpOnly: true,
      signed: true,
    })
    res.json({ message: messages.loggedIn })
  }
)

export const profile = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const { lastName, firstName, email } = res.locals.user
    res.json({
      lastName,
      firstName,
      email,
    })
  }
)

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    await authService.forgotPassword(req.body.email)
    res.json({ message: messages.passwordResetLinkSent })
  }
)

export const reset = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { sub } = res.locals.jwtPayload
    await authService.resetPassword(sub.toString(), req.body)
    res.json({ message: messages.passwordChanged })
  }
)
