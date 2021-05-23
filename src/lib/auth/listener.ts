/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable node/file-extension-in-import */
/* eslint-disable node/no-missing-import */
/* eslint-disable node/no-unsupported-features/es-syntax */
import { JwtPayload } from '../types'
import EventEmitter from '../utils/event'
import sendEmail from '../utils/mailer'
import { generateToken } from '../utils/jwt'
import { app } from '../../config'
import { User } from '../../app/user/user'

const HOST = app.APP_HOST

export default (): void => {
  EventEmitter.on('user:registered', async (user: User) => {
    const route = '/auth/verify'
    const payload: JwtPayload = {
      sub: user._id.toString(),
      aud: `${HOST}${route}/`,
    }
    const verificationToken = generateToken(payload)
    const verificationLink = `${HOST}${route}/${verificationToken}`

    // TODO: use email html template
    setImmediate(() =>
      sendEmail(
        user.email,
        'Account Verification',
        `<p>Please verify your account by clicking <a href="${verificationLink}">here</a></p>`
      )
    )
  })

  EventEmitter.on('user:password:forgot', async (user) => {
    const route = '/auth/password/reset'
    const payload: JwtPayload = {
      sub: user._id.toString(),
      aud: `${HOST}${route}`,
    }
    const passwordRegenerateToken = generateToken(payload)
    const passwordResetLink = `${HOST}${route}/${passwordRegenerateToken}`

    setImmediate(() => {
      sendEmail(
        user.email,
        'Password Reset',
        `<p>Click <a href="${passwordResetLink}">here</a> to reset your password.</p>`
      )
    })
  })

  EventEmitter.on('user:verified', async (user) => {
    setImmediate(() => {
      sendEmail(
        user.email,
        'Account Verified',
        '<p>You have succcessfully verified your account.</p>'
      )
    })
  })

  EventEmitter.on('user:password:reset', async (user) => {
    setImmediate(() => {
      sendEmail(
        user.email,
        'Password Changed',
        '<p>You have succcessfully updated your password.</p>'
      )
    })
  })
}
