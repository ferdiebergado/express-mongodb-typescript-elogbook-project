/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable node/no-missing-import */
/* eslint-disable node/file-extension-in-import */
/* eslint-disable node/no-unsupported-features/es-syntax */
import argon2 from 'argon2'
import { Hasher, HashVerifier } from '../types'

export const hash: Hasher = async (plainString: string): Promise<string> => {
  return await argon2.hash(plainString)
}

export const compare: HashVerifier = async (
  hashed: string,
  plainString: string
): Promise<boolean> => {
  return await argon2.verify(hashed, plainString)
}
