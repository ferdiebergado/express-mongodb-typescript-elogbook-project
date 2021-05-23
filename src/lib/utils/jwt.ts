/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable node/no-missing-import */
/* eslint-disable node/file-extension-in-import */
/* eslint-disable node/no-unsupported-features/es-syntax */
import jwt from 'jsonwebtoken'
// import {UnauthorizedException} from '../exceptions/http'
// import {makeRepository} from '../db'
import {app as appConfig, jwt as jwtOptions} from '../../config'
import {JwtPayload} from '../types'

const key = appConfig.APP_KEY
// const collection = 'tokens'
// const tokenRepository = makeRepository(collection)

// const validateToken = async (clientToken: Jwt): Promise<void> => {
//   const serverToken: Jwt = await tokenRepository.findFirst({
//     'signature': clientToken.signature,
//   })
//   if (!serverToken) throw new UnauthorizedException()

//   const jwtKeys = ['header', 'payload']
//   jwtKeys.forEach(jwtKey => {
//     for (const key in serverToken[jwtKey]) {
//       if (Object.prototype.hasOwnProperty.call(serverToken[jwtKey], key)) {
//         const element = serverToken[jwtKey][key];
//         if (element !== clientToken[jwtKey][key]) throw new UnauthorizedException()
//       }
//     }
//   })
// }

// const saveToken = async (token: string) => {
//   const decoded = decodeToken(token)
//   let entity = new Entity()
//   entity = {...entity, ...decoded}
//   await tokenRepository.create(entity)
// }

export const generateToken = (
  payload: JwtPayload,
  expiresIn = jwtOptions.expiresIn
): string => {
  // TODO: replace with crypto.randomUUID() when already available
  // const jti = crypto.randomBytes(24).toString('hex')
  return jwt.sign(payload, key, {...jwtOptions, expiresIn})
}

export const verifyToken = (token: string): JwtPayload => jwt.verify(token, key) as JwtPayload

// export const setToken = async (
//   payload: JwtPayload,
//   expiresIn?: string | number
// ): Promise<string> => {
//   const token = await generateToken(payload, expiresIn)
//   await saveToken(token)
//   return token
// }

// export const getToken = async (token: string): Promise<Jwt> => {
//   const decoded = decodeToken(token)
//   await validateToken(decoded)
//   return decoded
// }
