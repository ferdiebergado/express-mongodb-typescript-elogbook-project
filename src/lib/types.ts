/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable node/no-unsupported-features/es-syntax */
import { Request, Response, NextFunction } from 'express'

export type AsyncHttpFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>

export type HttpFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => void

export interface ValidationErrorItem {
  field: string | number
  message: string
}

export type ValidationErrors = Array<ValidationErrorItem>

export interface ErrorResponse {
  error: {
    message: string
    errors?: ValidationErrors
  }
}

export interface JwtHeader {
  alg: string
  typ: string
}

export interface JwtPayload {
  sub: string
  jti?: string
  iss?: string
  iat?: string
  exp?: string | number
  aud?: string
}

export interface Jwt extends Object {
  header: JwtHeader
  payload: JwtPayload
  signature: string
  [key: string]: any
}

export interface Hasher {
  (plainString: string): Promise<string>
}

export interface HashVerifier {
  (hashed: string, plainString: string): Promise<boolean>
}

export interface BaseRepository {
  create(entity: Entity): any
  findById(id: string | number): any
  findFirst(filter: Record<string, unknown>): any
  find(filter: Record<string, unknown>): any
  update(id: string | number, updates: Record<string, unknown>): any
  destroy(id: string | number): any
}

export class Entity {
  _id: any
  createdAt: string = new Date().toISOString()
  updatedAt: string = new Date().toISOString()
  deletedAt: string | undefined
  validationErrors: ValidationErrors = []
}

export interface UserDto {
  lastName: string
  firstName: string
  email: string
  password: string
  passwordConfirmation: string
}

export interface LoginCreds {
  email: string
  password: string
}

export interface DecodedToken {
  header: Record<string, unknown>
  payload: JwtPayload
  signature: string
}

export interface LoginData {
  body: any
  ip: string | undefined
  userAgent: string | undefined
}

export interface ResetPasswordData {
  password: string
  passwordConfirmation: string
}

export interface ClientData {
  formData: any
  ip: string | undefined
  userAgent: string | undefined
}

export interface AuthService {
  register(userDto: UserDto): Promise<string>
  login(creds: LoginCreds): Promise<string>
  verify(id: string): Promise<void>
  forgotPassword(email: string): Promise<void>
  resetPassword(id: string, data: ResetPasswordData): Promise<void>
}
