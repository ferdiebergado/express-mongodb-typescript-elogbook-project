/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable node/no-unsupported-features/es-syntax */
import jwt from 'jsonwebtoken'

const alg = 'HS256'

const jwtOptions: jwt.SignOptions = {
    algorithm: alg,
    expiresIn: 60 * 60 * 30, // in seconds
}

export default jwtOptions
