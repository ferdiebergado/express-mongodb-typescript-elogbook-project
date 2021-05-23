/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable node/file-extension-in-import */
/* eslint-disable node/no-missing-import */
/* eslint-disable node/no-unsupported-features/es-syntax */

import { messages } from '../../config'
import { Entity } from '../../lib/types'
import { titleCase } from '../../lib/utils/helpers'
import { isEmail } from '../../lib/utils/validation'

export class User extends Entity {
  lastName: string
  firstName: string
  email: string
  password: string
  emailVerifiedAt: string
}

const validator = {
  set: (obj: User, prop: string | symbol, value: any): boolean => {
    if (prop === 'lastName') {
      if (!value) {
        obj.validationErrors.push({
          field: prop,
          message: `${titleCase(prop)} is required`,
        })
        return true
      }
    }

    if (prop === 'firstName') {
      if (!value) {
        obj.validationErrors.push({
          field: prop,
          message: `${titleCase(prop)} is required`,
        })
        return true
      }
    }

    if (prop === 'email') {
      if (!value) {
        obj.validationErrors.push({
          field: prop,
          message: `${titleCase(prop)} is required`,
        })
        return true
      }

      if (!isEmail(value)) {
        obj.validationErrors.push({ field: prop, message: messages.notAnEmail })
        return true
      }
    }

    if (prop === 'password') {
      if (!value) {
        obj.validationErrors.push({
          field: prop,
          message: `${titleCase(prop)} is required`,
        })
        return true
      }

      // if (Number.isInteger(value)) {
      //   throw new TypeError('Lastname should be a string')
      // }
      // if (value > 200) {
      //   throw new RangeError('The age seems invalid')
      // }
    }

    // The default behavior to store the value
    // obj[prop] = value;

    return Reflect.set(obj, prop, value)

    // Indicate success
    // return true
  },
}

export const makeUserEntity = (): User => new Proxy(new User(), validator)
