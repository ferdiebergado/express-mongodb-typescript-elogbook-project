/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable node/no-missing-import */
/* eslint-disable node/file-extension-in-import */
/* eslint-disable node/no-unsupported-features/es-syntax */
import { InsertOneWriteOpResult, UpdateWriteOpResult } from 'mongodb'
import messages from '../../config/messages'
import {
  UnprocessableEntityException,
  UserNotFoundException,
} from '../exceptions/http'
import {
  BaseRepository,
  UserDto,
  ValidationErrors,
  ResetPasswordData,
  LoginCreds,
  AuthService,
} from '../types'
import { makeUserEntity, User } from '../../app/user/user'
import { compare, hash } from '../utils/hash'
import EventEmitter from '../utils/event'
import { generateToken } from '../utils/jwt'
import { InputValidationException } from '../exceptions/validation'
import { isEmail } from '../utils/validation'
import dispatchListeners from './listener'

dispatchListeners()

export const buildMakeAuthService = (userRepository: BaseRepository) => {
  return (): AuthService => {
    const register = async (newUser: UserDto): Promise<string> => {
      const {
        lastName,
        firstName,
        email,
        password,
        passwordConfirmation,
      } = newUser

      const user = makeUserEntity()

      user.lastName = lastName
      user.firstName = firstName
      user.email = email
      user.password = password

      const validationErrors = user.validationErrors

      if (!passwordConfirmation)
        validationErrors.push({
          field: 'passwordConfirmation',
          message: 'Passwordconfirmation is required',
        })
      if (passwordConfirmation && passwordConfirmation !== password)
        validationErrors.push({
          field: 'password',
          message: messages.passwordsDontMatch,
        })
      if (validationErrors.length > 0)
        throw new InputValidationException(validationErrors)

      const exists = await userRepository.findFirst({ email })
      if (exists) throw new UnprocessableEntityException(messages.userExists)

      user.password = await hash(password)

      const result: InsertOneWriteOpResult<User> = await userRepository.create(
        user
      )

      const id = result.insertedId.toString()
      const userInfo = {
        _id: id,
        lastName,
        firstName,
        email,
      }

      EventEmitter.emit('user:registered', userInfo)

      return id
    }

    const login = async (loginData: LoginCreds): Promise<string> => {
      const validationErrors: ValidationErrors = []

      const { email, password } = loginData
      if (!email) {
        validationErrors.push({ field: 'email', message: 'Email is required' })
      } else if (!isEmail(email)) {
        validationErrors.push({ field: 'email', message: messages.notAnEmail })
      }

      if (!password) {
        validationErrors.push({
          field: 'password',
          message: 'Password is required',
        })
      }

      if (validationErrors.length > 0)
        throw new InputValidationException(validationErrors)

      const exists: User = await userRepository.findFirst({
        email,
      })
      if (!exists) throw new UserNotFoundException()

      const isMatch = await compare(exists.password, password)
      if (!isMatch) throw new UserNotFoundException()

      const payload = {
        sub: exists._id.toString(),
      }
      return generateToken(payload)
    }

    const verify = async (id: string): Promise<void> => {
      const result: UpdateWriteOpResult = await userRepository.update(id, {
        $set: { emailVerifiedAt: new Date().toISOString() },
      })

      if (result.matchedCount === 0) throw new UserNotFoundException()
    }

    const forgotPassword = async (email: string): Promise<void> => {
      const validationErrors = []
      if (!email)
        validationErrors.push({
          field: 'email',
          message: 'Email is required',
        })

      if (email && !isEmail(email))
        validationErrors.push({ field: 'email', message: messages.notAnEmail })

      if (validationErrors.length > 0)
        throw new InputValidationException(validationErrors)

      const user = await userRepository.findFirst({ email })
      if (!user) throw new UserNotFoundException()
      EventEmitter.emit('user:password:forgot', user)
    }

    const resetPassword = async (
      id: string,
      data: ResetPasswordData
    ): Promise<void> => {
      const validationErrors: ValidationErrors = []
      const { password, passwordConfirmation } = data
      if (!password)
        validationErrors.push({
          field: 'password',
          message: 'Password is required',
        })
      if (!passwordConfirmation)
        validationErrors.push({
          field: 'passwordConfirmation',
          message: 'Passwordconfirmation is required',
        })
      if (password && passwordConfirmation && password !== passwordConfirmation)
        validationErrors.push({
          field: 'password',
          message: messages.passwordsDontMatch,
        })
      if (validationErrors.length > 0)
        throw new InputValidationException(validationErrors)

      const user = await userRepository.findById(id)
      if (!user) throw new UserNotFoundException()

      const hashed = await hash(password)
      await userRepository.update(user._id, { $set: { password: hashed } })
      EventEmitter.emit('user:password:reset', user)
    }

    return Object.freeze({
      register,
      login,
      verify,
      forgotPassword,
      resetPassword,
    })
  }
}
