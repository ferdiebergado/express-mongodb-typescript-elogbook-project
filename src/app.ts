/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable node/no-missing-import */
/* eslint-disable node/file-extension-in-import */
/* eslint-disable node/no-unsupported-features/es-syntax */
import express from 'express'
import cookieParser from 'cookie-parser'
import './lib/utils/env'
import { logger, notfound, error as errorHandler } from './lib/middlewares'
import { app as appConfig } from './config'
import authRoutes from './lib/auth/routes'
// import documentRoutes from "./app/document/route";

const app = express()

app.disable('x-powered-by')

app.use(logger)
app.use(cookieParser(appConfig.APP_KEY))
app.use(express.json())
// app.get('/favicon.ico', (_req, res) => res.status(204).end())
app.use('/auth', authRoutes)
//app.use("/documents", documentRoutes);
app.use(notfound)
app.use(errorHandler)

export default app
