/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable node/file-extension-in-import */
/* eslint-disable node/no-missing-import */
/* eslint-disable node/no-unsupported-features/es-syntax */
import app from '../src/app'
import request, {Response} from 'supertest'
import {DeleteWriteOpResultObject} from 'mongodb'
import {generateToken, verifyToken} from '../src/lib/utils/jwt'
import {compare} from '../src/lib/utils/hash'
import {client, getDb, makeRepository} from '../src/lib/db'
import {UserDto} from '../src/lib/types'
import {titleCase} from '../src/lib/utils/helpers'
import cookieUtil from 'cookie'
import cookieSigner from 'cookie-signature'
import {app as appConfig, messages} from '../src/config'

const basePath = '/auth'
const endpoints = {
  register: basePath + '/register',
  verify: basePath + '/verify',
  login: basePath + '/login',
  user: basePath + '/user',
  forgot: basePath + '/password/forgot',
  reset: basePath + '/password/reset',
}
const json = 'application/json'
const COLLECTION = 'users'
const userRepository = makeRepository(COLLECTION)

const user1: UserDto = {
  lastName: 'gibbons',
  firstName: 'mel',
  email: 'mmmuommomoomoomoooomooomomommomo@momombommooomooooo.com',
  password: '111',
  passwordConfirmation: '111',
}

const user: UserDto = {
  lastName: 'bondat jr.',
  firstName: 'james',
  email: 'momuomoomomomooomoomobmmomyymooail@yagomomhhmomomomm.com',
  password: '1333',
  passwordConfirmation: '1333',
}

describe('User authentication', () => {
  let userId: string
  let user1Id: string

  const createUser = async (newUser: UserDto) => {
    const response = await request(app)
      .post(endpoints.register)
      .type(json)
      .send(newUser)
    userId = response.body._id
    return response
  }

  const destroyUser = async (
    id: string
  ): Promise<DeleteWriteOpResultObject> => {
    return await userRepository.destroy(id)
  }

  const findUser = async (id: string): Promise<any> => {
    return await userRepository.findById(id)
  }

  const findUserByEmail = async (email: string): Promise<any> => {
    return await userRepository.findFirst({email})
  }

  beforeAll(async () => {
    const response = await createUser(user1)

    user1Id = response.body._id
  })

  afterAll(async () => {
    await destroyUser(user1Id)
    const db = await getDb()
    await db.dropCollection(COLLECTION)
    await client.close()
    console.log('Database refreshed and closed.')
  })

  afterEach(async () => {
    await destroyUser(userId)
  })

  const assertReponseErrors = (
    response: Response,
    expectedStatusCode: number,
    fieldWithError: string,
    errorMessage: string,
    index = 0
  ): void => {
    const {
      status,
      body: {error},
    } = response
    expect(status).toEqual(expectedStatusCode)
    expect(error).toHaveProperty('message')
    expect(error).toHaveProperty('errors')
    expect(error.errors[index].field).toEqual(fieldWithError)
    expect(error.errors[index].message).toEqual(errorMessage)
  }

  // REGISTRATION
  describe('POST ' + endpoints.register, () => {
    test('should create a new user and return the id', async () => {
      const response = await createUser(user)
      const {status, body} = response

      expect(status).toEqual(201)
      expect(body).toHaveProperty('_id')
      expect(body._id).toBeTruthy()

      const result = await findUser(body._id)
      expect(result.email).toBe(user.email)
    })

    test.each(Object.keys(user))(
      'should return an error when %s is empty',
      async (field) => {
        const tempUser = {...user, [field]: ''}
        const response = await createUser(tempUser)
        assertReponseErrors(
          response,
          400,
          field,
          `${titleCase(field)} is required`
        )

        const result = await findUserByEmail(tempUser.email)
        expect(result).toBeFalsy()
      }
    )

    test('should return an error when email is not a valid email', async () => {
      const tempUser = {...user, email: 'fakeemail'}
      const response = await createUser(tempUser)
      assertReponseErrors(response, 400, 'email', messages.notAnEmail)
      const result = await findUserByEmail(tempUser.email)
      expect(result).toBeFalsy()
    })

    test('should return an error when email is already taken', async () => {
      const response = await createUser(user1)
      const {status, body} = response

      expect(status).toEqual(422)
      expect(body).toHaveProperty('error.message')
      expect(body.error.message).toEqual(messages.userExists)

      const result = await userRepository.find({email: user1.email})
      expect(await result.count()).toBe(1)
    })

    test('should return an error when passwords do not match', async () => {
      const tempUser = {...user, passwordConfirmation: 'incorrect'}
      const response = await createUser(tempUser)
      assertReponseErrors(
        response,
        400,
        'password',
        messages.passwordsDontMatch
      )

      const result = await findUserByEmail(tempUser.email)
      expect(result).toBeFalsy()
    })

    // TODO: install mailhog-node
    test.todo('should receive a verification email on succcessful registration')
  })

  const verifyUser = async (token: string) => {
    return await request(app).get(`${endpoints.verify}/${token}`).type(json)
  }

  // VERIFY
  describe('GET /auth/verify', () => {
    test('user should be verified when token is valid', async () => {
      const token = generateToken({sub: user1Id})
      const {status, body} = await verifyUser(token)
      expect(status).toBe(200)
      expect(body).toHaveProperty('message')
      expect(body.message).toBe('Account verified!')
    })

    test.todo('should return an error when token is expired')
    test.todo('should return an error when user does not exist')
  })

  const loginUser = async (
    creds?: Record<string, unknown> | undefined
  ): Promise<Response> => {
    return await request(app).post(endpoints.login).type(json).send(creds)
  }

  // LOGIN
  describe('POST ' + endpoints.login, () => {
    test('should return a token cookie when credentials are valid', async () => {
      const {headers} = await loginUser({
        email: user1.email,
        password: user1.password,
      })
      expect(headers).toHaveProperty('set-cookie')

      const cookie = headers['set-cookie'][0]
      const parsed = cookieUtil.parse(cookie)
      const token = parsed.token.replace('s:', '')
      const unsignedToken = cookieSigner.unsign(token, appConfig.APP_KEY)
      expect(unsignedToken).toBeTruthy()

      let payload: any;
      if (unsignedToken) {
        payload = verifyToken(unsignedToken)
      }
      expect(payload.sub).toBe(user1Id)
    })

    // eslint-disable-next-line jest/expect-expect
    test('should return an error when credentials are missing', async () => {
      const response = await loginUser()
      assertReponseErrors(response, 400, 'email', 'Email is required')
      assertReponseErrors(response, 400, 'password', 'Password is required', 1)
    })

    test.each(['email', 'password'])(
      'should return an error when %s is missing',
      async (field) => {
        const tempUser = {
          email: user1.email,
          password: user1.password,
          [field]: null,
        }
        const response = await loginUser(tempUser)
        const message = `${titleCase(field)} is required`

        assertReponseErrors(response, 400, field, message)

        expect(response.headers).not.toHaveProperty('set-cookie')
      }
    )

    // eslint-disable-next-line jest/expect-expect
    test('should return an error when email is not a valid email', async () => {
      const creds = {
        email: 'abc@123',
        password: user1.password
      }
      const login = await loginUser(creds)
      assertReponseErrors(login, 400, 'email', messages.notAnEmail)
    })

    test('should return an error when email does not exist', async () => {
      const creds = {
        email: 'email@dontexist.com',
        password: user1.password
      }
      const {status, body} = await loginUser(creds)
      expect(status).toBe(400)
      expect(body).toHaveProperty('error')
      expect(body.error).toHaveProperty('message')
      expect(body.error.message).toBe(messages.invalidUser)
    })

    test('should return an error when password is incorrect', async () => {
      const creds = {
        email: user1.email,
        password: 'incorrect'
      }
      const {status, body} = await loginUser(creds)
      expect(status).toBe(400)
      expect(body).toHaveProperty('error')
      expect(body.error).toHaveProperty('message')
      expect(body.error.message).toBe(messages.invalidUser)
    })
  })

  const getUser = async () => {
    return await request(app).get(endpoints.user)
  }

  const getUserWithToken = async (token: string, signed = true) => {
    let cookie = token
    if (!signed) {
      const signedToken = cookieSigner.sign(token, appConfig.APP_KEY)
      const signedCookie = cookieUtil.serialize('token', 's:' + signedToken, {httpOnly: true, expires: new Date(Date.now() + 180000)})
      cookie = signedCookie
    }

    return await request(app).get(endpoints.user).set('Cookie', cookie).send()
  }

  // PROFILE
  describe('GET ' + endpoints.user, () => {
    test('should return the user when token is valid', async () => {
      const {lastName, firstName, email, password} = user1
      const login = await loginUser({email, password})
      const token = login.headers['set-cookie'][0]
      const {status, body} = await getUserWithToken(token)
      expect(status).toEqual(200)
      expect(body).toEqual(
        expect.objectContaining({
          lastName,
          firstName,
          email,
        })
      )
    })

    test('should return an error when token is not set', async () => {
      const response = await getUser()
      const {status, body} = response
      expect(status).toEqual(401)
      expect(body).toHaveProperty('error')
      expect(body.error).toHaveProperty('message')
      expect(body.error.message).toEqual(messages.authCredsMissing)
    })

    test('should return an error when user in token is invalid', async () => {
      const token = generateToken({
        sub: userId,
      })
      const response = await getUserWithToken(token, false)
      const {status, body} = response

      expect(status).toEqual(401)
      expect(body).toHaveProperty('error')
      expect(body.error).toHaveProperty('message')
      expect(body.error.message).toEqual(messages.authCredsInvalid)
    })

    test('should return an error when token is expired', async () => {
      const token = generateToken(
        {
          sub: user1Id,
        },
        '1'
      )
      const response = await getUserWithToken(token, false)
      const {status, body} = response
      expect(status).toEqual(401)
      expect(body).toHaveProperty('error')
      expect(body.error).toHaveProperty('message')
      expect(body.error.message).toEqual('jwt expired')
    })
  })

  const postForgotPassword = async (
    data: any = {email: null}
  ): Promise<any> => {
    return await request(app).post(endpoints.forgot).type(json).send(data)
  }

  // FORGOT PASSWORD
  describe('POST ' + endpoints.forgot, () => {
    test('should send a password reset link to a valid email', async () => {
      const {status, body} = await postForgotPassword({email: user1.email})
      expect(status).toEqual(200)
      expect(body).toHaveProperty('message')
      expect(body.message).toEqual(messages.passwordResetLinkSent)
    })

    // eslint-disable-next-line jest/expect-expect
    test('should return an error when no email was specified', async () => {
      const response = await postForgotPassword(undefined)
      // expect(response.status).toBe(400)
      const field = 'email'
      assertReponseErrors(
        response,
        400,
        field,
        `${titleCase(field)} is required`
      )
    })

    // eslint-disable-next-line jest/expect-expect
    test('should return an error when email is not a valid email', async () => {
      const response = await postForgotPassword({email: 'abc@123com'})
      assertReponseErrors(response, 400, 'email', messages.notAnEmail)
    })

    test('should return an error when email does not exist', async () => {
      const {status, body} = await postForgotPassword({email: 'user1@email.com'})
      expect(status).toBe(400)
      expect(body).toHaveProperty('error')
      expect(body.error).toHaveProperty('message')
      expect(body.error.message).toBe(messages.invalidUser)
    })
  })

  const resetUserPassword = async (
    token: string,
    newPassword: Record<string, unknown>
  ): Promise<any> => {
    return await request(app)
      .post(`${endpoints.reset}/${token}`)
      .type(json)
      .send(newPassword)
  }

  // RESET PASSWORD
  describe('POST ' + endpoints.reset, () => {
    test.each(['password', 'passwordConfirmation'])('should return an error when %s is missing', async (field) => {
      const token = generateToken({sub: user1Id})
      const data = {
        password: 'password',
        passwordConfirmation: 'password'
      }
      const response = await resetUserPassword(token, {...data, [field]: ''})
      assertReponseErrors(response, 400, field, `${titleCase(field)} is required`)
    })

    // eslint-disable-next-line jest/expect-expect
    test('should return an error when passwords do not match', async () => {
      const token = generateToken({sub: user1Id})
      const data = {
        password: 'password',
        passwordConfirmation: 'passwords'
      }
      const response = await resetUserPassword(token, data)
      assertReponseErrors(response, 400, 'password', messages.passwordsDontMatch)
    })

    test('password should be updated when token is valid', async () => {
      const token = generateToken({sub: user1Id})
      const newPassword = 'newpassword'
      const response = await resetUserPassword(token, {
        password: newPassword,
        passwordConfirmation: newPassword,
      })
      expect(response.status).toEqual(200)
      expect(response.body.message).toEqual(messages.passwordChanged)

      const user = await userRepository.findById(user1Id)
      const verified = await compare(user.password, newPassword)
      expect(verified).toBe(true)
    })
  })
})
