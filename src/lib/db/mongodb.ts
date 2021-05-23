/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable node/no-missing-import */
/* eslint-disable node/file-extension-in-import */
/* eslint-disable node/no-unsupported-features/es-syntax */
import {Db, ObjectId} from 'mongodb'
import {BaseRepository, Entity} from '../types'

export const buildMakeMongoDbRepository = ({
  getDb,
}: {
  getDb: () => Promise<Db>
}) => {
  return (collection: string): BaseRepository => {
    const create = async (entity: Entity): Promise<any> => {
      const db = await getDb()
      return await db.collection(collection).insertOne(entity)
    }

    const findFirst = async (filter: Record<string, unknown>): Promise<any> => {
      const db = await getDb()
      return await db.collection(collection).findOne(filter)
    }

    const findById = async (id: string | number): Promise<any> => {
      const db = await getDb()
      return await db.collection(collection).findOne({_id: new ObjectId(id)})
    }

    const find = async (filter: Record<string, unknown>): Promise<any> => {
      const db = await getDb()
      return db.collection(collection).find(filter)
    }

    const update = async (
      id: string | number,
      updates: Record<string, unknown>
    ): Promise<any> => {
      const db = await getDb()
      return await db
        .collection(collection)
        .updateOne({_id: new ObjectId(id)}, updates)
    }

    const destroy = async (id: string | number): Promise<any> => {
      const db = await getDb()
      return await db
        .collection(collection)
        .deleteOne({_id: new ObjectId(id)})
    }

    return Object.freeze({
      create,
      findFirst,
      findById,
      find,
      update,
      destroy,
    })
  }
}
