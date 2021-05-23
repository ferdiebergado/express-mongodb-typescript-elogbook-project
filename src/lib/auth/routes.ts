/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable node/no-missing-import */
/* eslint-disable node/file-extension-in-import */
/* eslint-disable node/no-unsupported-features/es-syntax */
import {Router} from 'express'
import {
  register,
  verify,
  login,
  profile,
  forgotPassword,
  reset,
} from './handler'
import authenticateToken from '../middlewares/auth'
import verifyToken from '../middlewares/verifier'

const router = Router()

router.post('/register', register)
router.get('/verify/:token', verifyToken, verify)
router.post('/login', login)
router.get('/user', authenticateToken, profile)
router.post('/password/forgot', forgotPassword)
router.post(
  '/password/reset/:token',
  verifyToken,
  reset
)

export default router
