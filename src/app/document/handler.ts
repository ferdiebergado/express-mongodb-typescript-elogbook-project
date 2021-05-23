/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable node/file-extension-in-import */
/* eslint-disable node/no-missing-import */
/* eslint-disable node/no-unsupported-features/es-syntax */
import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { dbexec } from "../../lib/utils/db";
import asyncHandler from "../../lib/middlewares/asyncHandler";

const COLLECTION = "documents";

export const store = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const result = await dbexec(COLLECTION, (coll) =>
      coll.insertOne(res.locals.validated)
    );
    res.status(201).json(result);
  }
);

export const index = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const rows = await dbexec(COLLECTION, (coll) => coll.find({}).toArray());
    res.json(rows);
  }
);

export const show = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    res.json(res.locals.data);
  }
);

export const update = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    await dbexec(COLLECTION, (coll) =>
      coll.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: res.locals.validated }
      )
    );
    res.json({
      message: "Document updated.",
    });
  }
);

export const destroy = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    await dbexec(COLLECTION, (coll) =>
      coll.deleteOne({ _id: new ObjectId(req.params.id) })
    );
    res.json({ message: "Deleted." });
  }
);
