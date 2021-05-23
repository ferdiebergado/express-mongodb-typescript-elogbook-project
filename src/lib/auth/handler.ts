/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable node/no-missing-import */
/* eslint-disable node/file-extension-in-import */
/* eslint-disable node/no-unsupported-features/es-syntax */
import { Request, Response } from 'express'
import asyncHandler from '../middlewares/asyncHandler'
import messages from '../../config/messages'
import { makeUserService } from './'

const userService = makeUserService()

export const register = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const id = await userService.register(req.body)
    res.status(201).json({ _id: id })
  }
)

export const verify = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const { sub } = res.locals.jwtPayload
    await userService.verify(sub)
    res.json({ message: 'Account verified!' })
  }
)

export const login = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const token = await userService.login(req.body)
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
    await userService.forgotPassword(req.body.email)
    res.json({ message: messages.passwordResetLinkSent })
  }
)

export const reset = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { sub } = res.locals.jwtPayload
    await userService.resetPassword(sub.toString(), req.body)
    res.json({ message: messages.passwordChanged })
  }
)
