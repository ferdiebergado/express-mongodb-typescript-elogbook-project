/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable node/file-extension-in-import */
/* eslint-disable node/no-missing-import */
/* eslint-disable node/no-unsupported-features/es-syntax */
import { buildMakeMongoDbRepository } from './mongodb'
import { db } from '../../config'
import { Db, Logger, MongoClient } from 'mongodb'

const { URI, NAME, OPTIONS } = db
export const client = new MongoClient(URI, OPTIONS)

Logger.setLevel('debug')
const dateStr = new Date().toISOString()
Logger.setCurrentLogger((msg, ctx) => {
  console.log(dateStr, msg, ctx)
})

let dbName = NAME

if (process.env.NODE_ENV === 'test') dbName = 'test'

export const getDb = async (): Promise<Db> => {
  if (!client.isConnected()) await client.connect()
  return client.db(dbName)
}

export const makeRepository = buildMakeMongoDbRepository({ getDb })
